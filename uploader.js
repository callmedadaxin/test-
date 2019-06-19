const path = require("path");
const fs = require("fs");
const qiniu = require("qiniu");
const cache = require("./cache");
const uuid = require("uuid/v1");
const c = require("./config");
const axios = require("axios");
const { stringify } = require("query-string");
const config = c.qiniu;

const qiniuConfig = new qiniu.conf.Config();

const mac = new qiniu.auth.digest.Mac(config.ACCESS_KEY, config.SECRET_KEY);
const putPolicy = new qiniu.rs.PutPolicy({
  scope: config.Bucket_Name
});
const uploadToken = putPolicy.uploadToken(mac);
const putExtra = new qiniu.form_up.PutExtra();

qiniuConfig.zone = qiniu.zone.Zone_z2;
qiniuConfig.useHttpsDomain = false;
qiniuConfig.useCdnDomain = false;

const qiniuUploader = new qiniu.form_up.FormUploader(qiniuConfig);

function upload(filePath) {
  return new Promise((resolve, reject) => {
    qiniuUploader.putFile(uploadToken, uuid(), filePath, putExtra, function(
      respErr,
      respBody,
      respInfo
    ) {
      if (respErr) {
        return reject(respErr);
      }
      if (respInfo.statusCode === 200) {
        console.log(filePath, "上传成功");
        cache.set(filePath, respBody);
        return resolve(respBody);
      } else {
        console.log(filePath, "上传失败");
        return reject(respBody);
      }
    });
  });
}

const getAllDir = () => {
  return fs.readdirSync(c.imgRoot).filter(item => item !== ".DS_Store");
};

const getAllImagesInDir = dir => {
  return fs
    .readdirSync(dir)
    .filter(item => item !== ".DS_Store")
    .map(p => path.join(dir, p));
};

function getLocation(address) {
  const cacheAdd = cache.get(address);

  if (cacheAdd) return cacheAdd;

  const params = {
    address,
    key: c.baiduKey,
    city: "北京",
    output: "json"
  };
  const url = `http://api.map.baidu.com/geocoder?${stringify(params)}`;

  return axios.get(url).then(res => res.data.result);
}

const getImages = () => {
  const places = getAllDir();
  // const results = [];
  // const placePath = places.map(item => path.join(c.imgRoot, item))

  const req = places.map(place => {
    const basePath = path.join(c.imgRoot, place);
    const imgs = getAllImagesInDir(basePath);

    const resultReqs = imgs.map(img => {
      if (cache.get(img)) return cache.get(img);

      return upload(img);
    });

    return Promise.all(resultReqs).then(items => {
      return getLocation(place)
        .then(location => {
          const result = {
            place,
            location,
            list: items.map(item => item.key)
          };
          return result;
        })
        .catch(e => {
          console.log(e, place);
        });
    });
  });

  Promise.all(req)
    .then(results => {
      fs.writeFileSync(c.jsonRoot, JSON.stringify(results), "utf8");
    })
    .catch(e => {
      console.log(e);
    });
};

getImages();
