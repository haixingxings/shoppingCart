import React from "react";
import { connect } from "dva";
import { Pagination } from "antd";
import Footer from "../components/footer";
import Cart from "../components/cart";
import FLoatNav from "../components/floatNav";
import ListItem from "../components/listItem";
import styles from "./IndexPage.less";
import lan from "../assets/lan.png";
import loadingIcon from "../assets/loading.gif";

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
    this.getCartList({ page: 1, pageSize: 15, size: "all", remark: "all" });
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
        type: "cart/init",
        carList,
        sumCount,
        sumPrice,
      });
    }
  };
  //获取购物车列表数据
  getCartList = (payload) => {
    this.props.dispatch({
      type: "cart/fetch",
      payload,
    });
  };
  showCart = (bool) => {
    this.setState({
      isShowCart: bool,
    });
  };
  handleSizeChange = (e, id) => {
    this.setState({ size: e.target.value });
    let info = { id, size: e.target.value };
    this.props.dispatch({ type: "cart/changeSize", info });
  };
  addToCart = (info) => {
    this.props.dispatch({ type: "cart/sendCar", info });
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
        this.getCartList({
          page: 1,
          pageSize: 15,
          size: items[index].key,
          remark: this.state.remakItems[this.state.currenRemarkIndex].key,
        });
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
        this.getCartList({
          page: 1,
          pageSize: 15,
          size: this.state.checkboxItems[this.state.currenIndex].key,
          remark: items[index].key,
        });
      }
    );
  };
  changePage = (page, pageSize) => {
    this.setState(
      {
        current: page,
      },
      () => {
        this.getCartList({
          page,
          pageSize,
          size: this.state.checkboxItems[this.state.currenIndex].key,
          remark: this.state.remakItems[this.state.currenRemarkIndex].key,
        });
      }
    );
  };
  render() {
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
            </ul>
          </div>
        </div>
        <div className={styles.container}>
          {this.props.cart.isLoading ? (
            <div className={styles.loading}>
              <img src={loadingIcon} alt="" />
            </div>
          ) : (
            <div>
              <div className={styles.product}>
                <ul className={styles["product-list"]}>
                  {this.props.cart.carData.length
                    ? this.props.cart.carData.map((item) => {
                        return (
                          <ListItem item={item} key={item.id + Math.random()} />
                        );
                      })
                    : null}
                </ul>
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
            </div>
          )}
        </div>
        <FLoatNav />
        <div className={styles.showCarBtn} onClick={() => this.showCart(true)}>
          <img src={lan} alt="cart" />
          <span className={styles.carCount}>{this.props.cart.sumCount}</span>
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
    cart: state.cart,
  };
};
export default connect(mapStateToProps)(IndexPage);
