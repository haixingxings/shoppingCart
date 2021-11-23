import React from "react";
import { connect } from "dva";
import axios from "axios";
import { Pagination, Radio } from "antd";
import Footer from "../components/footer";
import Cart from "../components/cart";
import FLoatNav from "../components/floatNav";
import ListItem from "../components/listItem";
import styles from "./IndexPage.less";
import lan from "../assets/lan.png";

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCart: false,
      // dataList: [],
      carCount: 0,
      currenIndex: 0,
      checkboxItems: [
        { content: "不限", checked: true, key: "all" },
        { content: "s", checked: false, key: "s" },
        { content: "xs", checked: false, key: "xs" },
        { content: "M", checked: false, key: "M" },
        { content: "xxs", checked: false, key: "xxs" },
      ],
      currenRemarkIndex: 0,
      remakItems: [
        { content: "按综合", checked: true, key: "all" },
        { content: "按销量", checked: false, key: "bySales" },
        { content: "按金额", checked: false, key: "byPrice" },
      ],
      current: 1,
      // size: "large",
    };
  }
  componentDidMount() {
    this.getCartList();
    this.init();
  }
  //获取缓存购物车数据
  init = () => {
    let carList =
      localStorage.getItem("carList") &&
      JSON.parse(localStorage.getItem("carList"));
    let sumCount = localStorage.getItem("sumCount") * 1;
    let sumPrice = localStorage.getItem("sumPrice") * 1;
    if (carList && sumCount && sumPrice) {
      this.props.dispatch({
        type: "counter/init",
        carList,
        sumCount,
        sumPrice,
      });
    }
  };
  //获取购物车列表数据
  getCartList = () => {
    this.props.dispatch({
      type: "counter/fetch",
      payload: { page: 1, pageSize: 15, size: "all", remark: "all" },
    });
  };
  showCart = (bool) => {
    this.setState({
      isShowCart: bool,
    });
  };
  // getData = (page = 1, pageSize = 15, size = "all", remark = "all") => {
  //   let url =
  //     "https://www.fastmock.site/mock/1d1e4fb3d58f7c7f823d24ce33529a1e/api";
  //   axios
  //     .get(
  //       url +
  //         "/getproductList" +
  //         `?page=${page}&pageSize=${pageSize}&size=${size}&remark=${remark}`
  //     )
  //     .then((res) => {
  //       if (res.data.code === "200") {
  //         let data = res.data.data.content.data;
  //         this.setState({
  //           dataList: data,
  //         });
  //       }
  //     });
  // };
  handleSizeChange = (e, id) => {
    console.log("选择的尺寸", e.target.value);
    this.setState({ size: e.target.value });
    let info = { id, size: e.target.value };
    this.props.dispatch({ type: "counter/changeSize", info });
  };
  addToCart = (info) => {
    this.props.dispatch({ type: "counter/sendCar", info });
  };
  getVal = (index) => {
    //复制原来的数组
    var items = [...this.state.checkboxItems];
    this.setState(
      {
        //更新checkboxItems全部选项
        checkboxItems: items,
        currenIndex: index,
        current: 1,
      },
      () => {
        this.getData(
          1,
          15,
          items[index].key,
          this.state.remakItems[this.state.currenRemarkIndex].key
        );
      }
    );
  };
  getRemarkVal = (index) => {
    //复制原来的数组
    var items = [...this.state.remakItems];
    this.setState(
      {
        //更新remakItems全部选项
        remakItems: items,
        currenRemarkIndex: index,
        current: 1,
      },
      () => {
        this.getData(
          1,
          15,
          this.state.checkboxItems[this.state.currenIndex].key,
          items[index].key
        );
      }
    );
  };
  changePage = (page, pageSize) => {
    this.setState(
      {
        current: page,
      },
      () => {
        this.getData(
          page,
          pageSize,
          this.state.checkboxItems[this.state.currenIndex].key,
          this.state.remakItems[this.state.currenRemarkIndex].key
        );
      }
    );
  };
  render() {
    // console.log("购物车数据", this.props.counter);
    return (
      <div className={`${styles.normal}`}>
        <div className={styles.container}>
          <div className={styles.search}>
            <ul>
              <li>
                <div className={styles.searchItem}>
                  <div className={styles.title}>尺 码</div>
                  <ul className={styles["size-List"]}>
                    {this.state.checkboxItems.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className={
                            this.state.currenIndex === index
                              ? styles.active
                              : null
                          }
                          onClick={() => this.getVal(index)}
                        >
                          {item.content}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
              <li>
                <div className={styles.searchItem}>
                  <div className={styles.title}>排 序</div>
                  <ul className={styles["size-List"]}>
                    {this.state.remakItems.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className={
                            this.state.currenRemarkIndex === index
                              ? styles.active
                              : null
                          }
                          onClick={() => this.getRemarkVal(index)}
                        >
                          {item.content}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
              <div>
                {/* {this.state.checkboxItems.map((ele, index) => {
                  return (
                    <span key={index}>
                      <input
                        type="checkbox"
                        name=""
                        value={index}
                        checked={ele.checked}
                        onChange={() => this.getVal(index)}
                      />
                      <span>{ele.content}</span>
                    </span>
                  );
                })} */}
              </div>
            </ul>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.product}>
            <ul className={styles["product-list"]}>
              {this.props.counter.carData.length
                ? this.props.counter.carData.map((item) => {
                    return (
                      <ListItem item={item} key={item.id + Math.random()} />
                      // <li key={item.id}>
                      //   <img
                      //     className={styles.clothImg}
                      //     src={item.detail.imgBig}
                      //     alt="cloth"
                      //   />
                      //   <p className={styles["product-name"]}>
                      //     <span>{item.detail.title}</span>
                      //     {/* <span className="p-size">S-XL</span> */}
                      //   </p>
                      //   <a
                      //     href="javascript"
                      //     className={styles["product-subName"]}
                      //   >
                      //     {item.detail.subTitle}
                      //   </a>
                      //   <div style={{ margin: "10px 0" }}>
                      //     <Radio.Group
                      //       // defaultValue={"s"}
                      //       value={
                      //         item.detail.currentSize || item.detail.sizes[0]
                      //       }
                      //       onChange={(e) => {
                      //         this.handleSizeChange(e, item.id);
                      //       }}
                      //     >
                      //       {item.detail.sizes.map((h) => {
                      //         return (
                      //           <Radio.Button
                      //             value={h}
                      //             key={item.id + Math.random()}
                      //           >
                      //             {h}
                      //           </Radio.Button>
                      //         );
                      //       })}
                      //     </Radio.Group>
                      //   </div>
                      //   <div className={styles["product-box"]}>
                      //     <div className={styles["product-price"]}>
                      //       <span>¥{item.detail.price}</span>
                      //     </div>
                      //     <div
                      //       className={styles["add-btn"]}
                      //       onClick={() => {
                      //         this.addToCart(item);
                      //       }}
                      //     >
                      //       {/* <img src={car} /> */}
                      //     </div>
                      //   </div>
                      // </li>
                    );
                  })
                : null}
            </ul>
          </div>
        </div>
        <div className={styles.pagination}>
          <Pagination
            current={this.state.current}
            total={20}
            pageSize={15}
            hideOnSinglePage={true}
            onChange={this.changePage}
          />
        </div>
        <FLoatNav />
        <div className={styles.showCarBtn} onClick={() => this.showCart(true)}>
          <img src={lan} alt="cart" />
          <span className={styles.carCount}>{this.props.counter.sumCount}</span>
        </div>
        {this.state.isShowCart ? (
          <Cart closeSelf={() => this.showCart(false)} />
        ) : null}
        <Footer />
      </div>
    );
  }
}

IndexPage.propTypes = {};
const mapStateToProps = (state) => {
  return {
    counter: state.counter,
  };
};
export default connect(mapStateToProps)(IndexPage);
