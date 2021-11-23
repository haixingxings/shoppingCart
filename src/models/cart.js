import axios from "axios";
import { url } from "../config";
export default {
  namespace: "cart",
  state: {
    carList: [],
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
      return {
        ...state,
        ...info,
      };
    },
    cut(state, action) {
      const { info } = action;
      return {
        ...state,
        ...info,
      };
    },
    clearAlls(state, action) {
      const { info } = action;
      return {
        ...state,
        ...info,
      };
    },
    save(state, action) {
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
      yield put({ type: "save", dataList });
    },
    //添加购物车
    *sendCar(payload, { call, put, select }) {
      const { info, currentSize } = payload;
      let infoData = JSON.parse(JSON.stringify(info));
      infoData.detail.sum += 1;
      infoData.detail.currentSize = currentSize;
      let sumPrice = yield select((state) => state.cart.sumPrice);
      const sumCount = yield select((state) => state.cart.sumCount);
      let infos = {};
      let carList = yield select((state) => state.cart.carList);
      if (carList.length) {
        carList.forEach((item, index) => {
          if (
            item.id === infoData.id &&
            item.detail.currentSize === infoData.detail.currentSize
          ) {
            item.detail.sum += 1;
          }
        });
        let findone = carList.find((item) => {
          return (
            item.id === infoData.id &&
            item.detail.currentSize === infoData.detail.currentSize
          );
        });
        if (!findone) {
          carList.push(infoData);
        }
      } else {
        carList.push(infoData);
      }
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
    //删减数量
    *clear(payload, { call, put, select }) {
      const { data } = payload;
      let sumPrice = yield select((state) => state.cart.sumPrice);
      let sumCount = yield select((state) => state.cart.sumCount);
      let carList = yield select((state) => state.cart.carList);
      let infos = {};
      carList.forEach((item, index) => {
        if (
          item.id === data.id &&
          item.detail.currentSize === data.detail.currentSize
        ) {
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
    //清空购物车
    *clearAll(payload, { call, put, select }) {
      localStorage.removeItem("carList");
      localStorage.removeItem("sumCount");
      localStorage.removeItem("sumPrice");
      let infos = {
        carList: [],
        sumCount: 0,
        sumPrice: 0,
      };
      yield put({ type: "clearAlls", info: infos });
    },
  },
};
