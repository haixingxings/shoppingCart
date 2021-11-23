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
      console.log("最后info", info);
      return {
        ...state,
        ...info,
      };
      // let id = action.info.id;
      // let sumPrice = state.sumPrice;
      // if (state.carListKey.includes(id)) {
      //   state.carList.forEach((item, index) => {
      //     if (item.id === action.info.id) {
      //       item.detail.sum += 1;
      //       let currentSum = item.detail.price * 1;
      //       sumPrice += currentSum;
      //     }
      //   });
      //   localStorage.setItem("carList", JSON.stringify(state.carList));
      //   localStorage.setItem("carListKey", JSON.stringify(state.carListKey));
      //   localStorage.setItem("sumCount", state.sumCount + 1);
      //   localStorage.setItem("sumPrice", state.sumPrice);
      //   return {
      //     ...state,
      //     carList: state.carList,
      //     sumCount: state.sumCount + 1,
      //     sumPrice,
      //   };
      // } else {
      //   let carList = [...state.carList, action.info];
      //   let carListKey = [...state.carListKey, id];
      //   let currentSum = action.info.detail.price * 1;
      //   sumPrice += currentSum;
      //   localStorage.setItem("carList", JSON.stringify(carList));
      //   localStorage.setItem("carListKey", JSON.stringify(carListKey));
      //   localStorage.setItem("sumCount", state.sumCount + 1);
      //   localStorage.setItem("sumPrice", sumPrice);
      //   return {
      //     ...state,
      //     carList,
      //     carListKey,
      //     sumCount: state.sumCount + 1,
      //     sumPrice,
      //   };
      // }
    },
    clear(state, action) {
      let sumPrice = state.sumPrice;
      state.carList.forEach((item, index) => {
        if (item.id === action.id) {
          let currentSum = item.detail.price * 1;
          if (item.detail.sum > 1) {
            item.detail.sum -= 1;
          } else {
            state.carList.splice(index, 1);
            state.carListKey.splice(index, 1);
          }
          sumPrice -= currentSum;
        }
      });
      localStorage.setItem("carList", JSON.stringify(state.carList));
      localStorage.setItem("carListKey", JSON.stringify(state.carListKey));
      localStorage.setItem("sumCount", state.sumCount - 1);
      localStorage.setItem("sumPrice", sumPrice);
      return {
        ...state,
        carList: state.carList,
        sumPrice,
        sumCount: state.sumCount - 1,
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
        }
      });
      console.log("更改尺寸", state.carData);
      return {
        ...state,
        carData: state.carData,
      };
    },
    // //更改购物车尺寸
    // changeCarSize(state, action) {
    //   const { info } = action;
    //   console.log("尺寸", info);
    //   state.carData.forEach((item) => {
    //     if (item.id === info.id) {
    //       item.detail.carSize = info.size;
    //     }
    //   });
    //   return {
    //     ...state,
    //     carData: state.carData,
    //   };
    // },
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
      dataList.carSize = [];
      console.log("产品列表数据", dataList);
      yield put({ type: "save", dataList });
    },
    //添加购物车
    *sendCar(payload, { call, put, select }) {
      const { info } = payload;
      console.log("点击了什么尺寸的", info);
      let sumPrice = yield select((state) => state.counter.sumPrice);
      const sumCount = yield select((state) => state.counter.sumCount);
      const carListKey = yield select((state) => state.counter.carListKey);
      let id = info.id;
      let infos = {};
      if (carListKey.includes(id)) {
        console.log("已经有存在了", id);
        let carList = yield select((state) => state.counter.carList);
        carList.forEach((item, index) => {
          if (item.id === payload.info.id) {
            if (
              payload.info.detail.carSize &&
              payload.info.detail.carSize.includes(item.detail.currentSize)
            ) {
              console.log(
                "连尺寸都相等",
                item.detail.currentSize,
                payload.info.detail.carSize
              );
              item.detail.sum += 1;
              let currentSum = item.detail.price * 1;
              sumPrice += currentSum;
              localStorage.setItem("carList", JSON.stringify(carList));
              localStorage.setItem("carListKey", JSON.stringify(carListKey));
              localStorage.setItem("sumCount", sumCount + 1);
              localStorage.setItem("sumPrice", sumPrice);
              infos = {
                carList: carList,
                sumCount: sumCount + 1,
                sumPrice,
              };
            } else {
              console.log(
                "尺寸不相等",
                item.detail.currentSize,
                payload.info.detail.carSize
              );
              let arr = [];
              arr.push(item.detail.currentSize);
              payload.info.detail.carSize = arr;
              // payload.info.detail.carSize = payload.info.detail.currentSize;
              console.log("尺寸不相等2", payload.info);
              // item.detail.sum += 1;
              let currentSum = item.detail.price * 1;
              sumPrice += currentSum;
              localStorage.setItem("carList", JSON.stringify(carList));
              localStorage.setItem("carListKey", JSON.stringify(carListKey));
              localStorage.setItem("sumCount", sumCount + 1);
              localStorage.setItem("sumPrice", sumPrice);
              infos = {
                carList: [...carList, payload.info],
                sumCount: sumCount + 1,
                sumPrice,
              };
            }
          }
        });
        yield put({ type: "add", info: infos });
      } else {
        console.log("第一次添加", payload.info);
        payload.info.detail.carSize = [];
        payload.info.detail.carSize.push(payload.info.detail.currentSize);
        let carLists = yield select((state) => state.counter.carList);
        let carListKeys = yield select((state) => state.counter.carListKey);
        let carList = [...carLists, payload.info];
        let carListKey = [...carListKeys, id];
        let currentSum = payload.info.detail.price * 1;
        sumPrice += currentSum;
        localStorage.setItem("carList", JSON.stringify(carList));
        localStorage.setItem("carListKey", JSON.stringify(carListKey));
        localStorage.setItem("sumCount", sumCount + 1);
        localStorage.setItem("sumPrice", sumPrice);
        let info = {
          carList,
          carListKey,
          sumCount: sumCount + 1,
          sumPrice,
        };
        yield put({ type: "add", info });
      }
    },
  },
};
