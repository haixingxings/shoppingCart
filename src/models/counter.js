import axios from "axios";
import { url } from "../config";
export default {
  namespace: "counter",
  state: {
    carList: [],
    carListKey: [],
    sumCount: 0,
    sumPrice: 0,
    carData: [],
  },
  reducers: {
    init(state, action) {
      return {
        ...state,
        ...action,
      };
    },
    add(state, action) {
      const { info } = action;
      console.log("最后添加的info", info);
      return {
        ...state,
        ...info,
      };
    },
    cut(state, action) {
      const { info } = action;
      console.log("最后减去的info", info);
      return {
        ...state,
        ...info,
      };
    },
    clearAll(state, action) {
      localStorage.removeItem("carList");
      localStorage.removeItem("carListKey");
      localStorage.removeItem("sumCount");
      localStorage.removeItem("sumPrice");
      return {
        ...state,
        carList: [],
        carListKey: [],
        sumCount: 0,
        sumPrice: 0,
      };
    },
    save(state, action) {
      console.log("action", action.dataList);
      return {
        ...state,
        carData: action.dataList,
      };
    },
    //更改尺寸
    changeSize(state, action) {
      const { info } = action;
      state.carData.forEach((item) => {
        if (item.id === info.id) {
          item.detail.currentSize = info.size;
          console.log("更改尺寸", item);
        }
      });
      return {
        ...state,
        carData: state.carData,
      };
    },
  },
  effects: {
    //请求产品列表数据
    *fetch({ payload }, { call, put }) {
      const { page, pageSize, size, remark } = payload;
      const data = yield call(
        axios.get,
        `${url}/getproductList?page=${page}&pageSize=${pageSize}&size=${size}&remark=${remark}`
      );
      const dataList = data.data.data.content.data;
      // dataList.detail.carSize = [];
      // dataList.detail.currentSize = dataList.detail.sizes[0];
      console.log("产品列表数据", dataList);
      yield put({ type: "save", dataList });
    },
    //添加购物车
    *sendCar(payload, { call, put, select }) {
      const { info, currentSize } = payload;
      let infoData = JSON.parse(JSON.stringify(info));
      console.log("点击了什么尺寸的", infoData, currentSize);
      infoData.detail.sum += 1;
      infoData.detail.currentSize = currentSize;
      let sumPrice = yield select((state) => state.counter.sumPrice);
      const sumCount = yield select((state) => state.counter.sumCount);
      const carListKey = yield select((state) => state.counter.carListKey);
      let id = infoData.id;
      let infos = {};
      let carList = yield select((state) => state.counter.carList);
      console.log("初始化carlist", carList);
      if (carList.length) {
        carList.forEach((item, index) => {
          console.log("id比较", item.id, infoData.id);
          console.log(
            "尺码比较",
            item.detail.currentSize,
            infoData.detail.currentSize
          );
          if (
            item.id === infoData.id &&
            item.detail.currentSize === infoData.detail.currentSize
          ) {
            item.detail.sum += 1;
          }
        });
        let findone = carList.find((item) => {
          console.log("find", item);
          return (
            item.id === infoData.id &&
            item.detail.currentSize === infoData.detail.currentSize
          );
        });
        console.log("findone", findone);
        if (!findone) {
          carList.push(infoData);
        }
      } else {
        carList.push(infoData);
      }
      console.log("此时购物车", carList);
      console.log("之前的钱", sumPrice);
      let currentSum = infoData.detail.price * 1;
      sumPrice += currentSum;
      localStorage.setItem("carList", JSON.stringify(carList));
      localStorage.setItem("sumCount", sumCount + 1);
      localStorage.setItem("sumPrice", sumPrice);
      infos = {
        carList: carList,
        sumCount: sumCount + 1,
        sumPrice,
      };
      yield put({ type: "add", info: infos });
    },
    *clear(payload, { call, put, select }) {
      console.log("减去", payload);
      const { data } = payload;
      let sumPrice = yield select((state) => state.counter.sumPrice);
      let sumCount = yield select((state) => state.counter.sumCount);
      let carList = yield select((state) => state.counter.carList);
      let infos = {};
      // let sumPrice = state.sumPrice;
      carList.forEach((item, index) => {
        if (
          item.id === data.id &&
          item.detail.currentSize === data.detail.currentSize
        ) {
          console.log("说明找到要减去的了", item);
          let currentSum = item.detail.price * 1;
          if (item.detail.sum > 1) {
            item.detail.sum -= 1;
          } else {
            carList.splice(index, 1);
          }
          sumCount -= 1;
          sumPrice -= currentSum;
          localStorage.setItem("carList", JSON.stringify(carList));
          localStorage.setItem("sumCount", sumCount);
          localStorage.setItem("sumPrice", sumPrice);
          if (sumCount < 0) {
            sumCount = 0;
          }
          if (sumPrice < 0) {
            sumPrice = 0;
          }
          infos = {
            carList,
            sumCount,
            sumPrice,
          };
        }
      });
      yield put({ type: "cut", info: infos });
    },
  },
};
