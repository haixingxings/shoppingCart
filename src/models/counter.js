import axios from "axios";
export default {
  namespace: "counter",
  state: {
    carList: [],
    carListKey: [],
    sumCount: 0,
    sumPrice: 0,
  },
  reducers: {
    init(state, action) {
      return {
        ...state,
        ...action,
      };
    },
    add(state, action) {
      let id = action.info.id;
      let sumPrice = state.sumPrice;
      if (state.carListKey.includes(id)) {
        state.carList.forEach((item, index) => {
          if (item.id === action.info.id) {
            item.detail.sum += 1;
            let currentSum = item.detail.price * 1;
            sumPrice += currentSum;
          }
        });
        localStorage.setItem("carList", JSON.stringify(state.carList));
        localStorage.setItem("carListKey", JSON.stringify(state.carListKey));
        localStorage.setItem("sumCount", state.sumCount + 1);
        localStorage.setItem("sumPrice", state.sumPrice);
        return {
          ...state,
          carList: state.carList,
          sumCount: state.sumCount + 1,
          sumPrice,
        };
      } else {
        let carList = [...state.carList, action.info];
        let carListKey = [...state.carListKey, id];
        let currentSum = action.info.detail.price * 1;
        sumPrice += currentSum;
        localStorage.setItem("carList", JSON.stringify(carList));
        localStorage.setItem("carListKey", JSON.stringify(carListKey));
        localStorage.setItem("sumCount", state.sumCount + 1);
        localStorage.setItem("sumPrice", sumPrice);
        return {
          ...state,
          carList,
          carListKey,
          sumCount: state.sumCount + 1,
          sumPrice,
        };
      }
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
  },
  effects: {
    getData(page = 1, pageSize = 15, size = "all", remark = "all") {
      let url =
        "https://www.fastmock.site/mock/1d1e4fb3d58f7c7f823d24ce33529a1e/api";
      axios
        .get(
          url +
            "/getproductList" +
            `?page=${page}&pageSize=${pageSize}&size=${size}&remark=${remark}`
        )
        .then((res) => {
          if (res.data.code === "200") {
            let data = res.data.data.content.data;
            this.setState({
              dataList: data,
            });
          }
        });
    },
  },
};
