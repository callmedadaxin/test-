import React, { useEffect } from "react";
import data from "./jsonResult.json";

const BMap = window.BMap;

class Map {
  // pointsMap = new Map();
  addWindow(item) {
    const win = new window.BMapLib.SearchInfoWindow(
      this.map,
      `<a href="/list/${item.place}">点击查看图片列表</a>`,
      {
        title: item.place, //标题
        width: 290, //宽度
        height: 40, //高度
        panel: "panel", //检索结果面板
        enableAutoPan: true, //自动平移
        searchTypes: []
      }
    );
    return win;
  }
  addMarker(item) {
    const pos = item.location ? item.location.location : {};
    const point = new BMap.Point(pos.lng, pos.lat);
    const marker = new BMap.Marker(point);
    const win = this.addWindow(item);
    this.map.addOverlay(marker);
    // this.pointsMap.set(marker, win);

    marker.addEventListener("click", function(e) {
      win.open(marker);
    });
  }
  addMarkers() {
    data.forEach(item => {
      this.addMarker(item);
    });
  }
  init() {
    var map = new BMap.Map("container"); // 创建Map实例
    map.centerAndZoom(new BMap.Point(116.404, 39.915), 11); // 初始化地图,设置中心点坐标和地图级别
    map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
    map.enableScrollWheelZoom(true);

    this.map = map;
  }
}

function App() {
  useEffect(() => {
    const map = new Map();
    map.init();
    map.addMarkers();
  }, []);
  return <div id="container" />;
}

export default App;
