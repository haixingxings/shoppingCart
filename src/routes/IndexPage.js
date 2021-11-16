import React from "react";
import { connect } from "dva";
import axios from "axios";
import { Pagination } from 'antd';
import Footer from "../components/footer";
import Cart from "../components/cart";
import FLoatNav from '../components/floatNav';
import styles from "./IndexPage.less";
import Logo from "../assets/logo2.png";
import lan from "../assets/lan.png";

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCart: false,
      dataList: [],
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
    };
  }
  componentDidMount() {
    this.getData();
    let carList =
      localStorage.getItem("carList") &&
      JSON.parse(localStorage.getItem("carList"));
    let carListKey =
      localStorage.getItem("carListKey") &&
      JSON.parse(localStorage.getItem("carListKey"));
    let sumCount = localStorage.getItem("sumCount") * 1;
    let sumPrice = localStorage.getItem("sumPrice") * 1;
    if (carList && carListKey && sumCount && sumPrice) {
      this.props.dispatch({
        type: "counter/init",
        carList,
        carListKey,
        sumCount,
        sumPrice,
      });
    }
  }
  showCart = (bool) => {
    this.setState({
      isShowCart: bool,
    });
  };
  getData = (page=1, pageSize=15, size = "all", remark = "all") => {
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
  };
  addToCart = (info) => {
    this.props.dispatch({ type: "counter/add", info });
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
        this.getData(1,15,
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
        this.getData(1,15,
          this.state.checkboxItems[this.state.currenIndex].key,
          items[index].key
        );
      }
    );
  };
  changePage=(page, pageSize)=>{
    this.setState({
      current: page,
    },()=>{
      this.getData(page,pageSize,
        this.state.checkboxItems[this.state.currenIndex].key,
        this.state.remakItems[this.state.currenRemarkIndex].key
      );
    });
  }
  render() {
    return (
      <div className={`${styles.normal}`}>
        <div className={styles.top}>
          <div className={`${styles.container} ${styles.navbar}`}>
            <div>
              地址：福州
              <a className={styles.changeCity} href="javascript">
                [ 切换城市 ]
              </a>
            </div>
            <ul className={styles.nav}>
              <li>
                <a href="javascript">我的易购</a>
              </li>
              <li>
                <a href="javascript">精选好物</a>
              </li>
              <li>
                <a href="javascript">手机APP</a>
              </li>
              <li>
                <a href="javascript">网站规则</a>
              </li>
              <li>
                <a href="javascript">海星星 <span>[ 退出登录 ]</span></a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.logo}>
          <div className={styles.container}>
            <div className={styles.logoPng}>
              <img src={Logo} alt='logo'/>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.search}>
            <ul>
              <li>
                <div className={styles.searchItem}>
                  <div className={styles.title}>款 型</div>
                  <div className={styles.searchAll}>不限</div>
                  <ul className={styles["size-List"]}>
                    <li>经济</li>
                    <li>舒适</li>
                    <li>高档</li>
                    <li>豪华</li>
                  </ul>
                </div>
              </li>
              <li>
                <div className={styles.searchItem}>
                  <div className={styles.title}>品牌</div>
                  <div className={styles.searchAll}>不限</div>
                  <ul className={styles["size-List"]}>
                    <li>苹果</li>
                    <li>九牧</li>
                    <li>七匹狼</li>
                    <li>安踏</li>
                    <li>李宁</li>
                    <li>鳄鱼</li>
                  </ul>
                </div>
              </li>
              <li>
                <div className={styles.searchItem}>
                  <div className={styles.title}>类 型</div>
                  <div className={styles.searchAll}>不限</div>
                  <ul className={styles["size-List"]}>
                    <li>休闲</li>
                    <li>修身</li>
                    <li>正式</li>
                    <li>大码</li>
                  </ul>
                </div>
              </li>
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
              {this.state.dataList.length
                ? this.state.dataList.map((item) => {
                    return (
                      <li key={item.id}>
                        <img
                          className={styles.clothImg}
                          src={item.detail.imgBig}
                          alt='cloth'
                        />
                        <p className={styles["product-name"]}>
                          <span>{item.detail.title}</span>
                          <span className="p-size">S-XL</span>
                        </p>
                        <a href="javascript" className={styles["product-subName"]}>
                          {item.detail.subTitle}
                        </a>
                        <div className={styles["product-box"]}>
                          <div className={styles["product-price"]}>
                            <span>¥{item.detail.price}</span>
                          </div>
                          <div
                            className={styles["add-btn"]}
                            onClick={() => {
                              this.addToCart(item);
                            }}
                          >
                            {/* <img src={car} /> */}
                          </div>
                        </div>
                      </li>
                    );
                  })
                : null}
            </ul>
          </div>
        </div>
        <div className={styles.pagination}>
          <Pagination current={this.state.current} total={20} pageSize={15} hideOnSinglePage={true} onChange={this.changePage}/>
        </div>
        <FLoatNav/>
        <div className={styles.showCarBtn} onClick={() => this.showCart(true)}>
          <img src={lan} alt='cart'/>
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
