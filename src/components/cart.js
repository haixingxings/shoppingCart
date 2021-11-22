import React from "react";
import { connect } from "dva";
import { message } from "antd";
import car2 from "../assets/car2.png";
import close from "../assets/close.png";
import Add from "../assets/add.png";
import Cut from "../assets/cut.png";
import close2 from "../assets/close2.png";
import carNo from "../assets/carno.png";
import assetsStyle from "./index.less";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  closeSelf = () => {
    this.props.closeSelf && this.props.closeSelf();
  };
  clear = (id) => {
    this.props.dispatch({ type: "counter/clear", id });
  };
  clearAll = () => {
    this.props.dispatch({ type: "counter/clearAll" });
  };
  addToCart = (info) => {
    this.props.dispatch({ type: "counter/add", info });
  };
  goToPay = () => {
    if (this.props.counter.carList.length) {
      message.success("结算成功");
      this.props.closeSelf && this.props.closeSelf();
      this.props.dispatch({ type: "counter/clearAll" });
    } else {
      message.info("快去添加你所喜欢的商品吧");
      this.props.closeSelf && this.props.closeSelf();
    }
  };
  render() {
    return (
      <div className={assetsStyle.cart}>
        <div className={assetsStyle.cartbox}>
          <div className={assetsStyle.carTitle}>
            <img src={car2} alt="carticon" />
            <span>购物车</span>
          </div>
          <img
            src={close2}
            className={assetsStyle.close2}
            onClick={this.closeSelf}
            alt="closeIcon"
          />
        </div>
        <div className={assetsStyle.cartList}>
          {this.props.counter.carList.length ? (
            <ul>
              {this.props.counter.carList.map((item) => {
                return (
                  <li key={item.id}>
                    <div className={assetsStyle.infoLeft}>
                      <div>
                        <img src={item.detail.imgSm} alt="img" />
                      </div>
                      <div className={assetsStyle.cartInfo}>
                        <a href="javascript" className={assetsStyle.itemTitle}>
                          {item.detail.title}
                        </a>
                        <p className={assetsStyle.subInfo}>
                          {item.detail.subTitle}
                        </p>
                        <p className={assetsStyle.priceInfo}>
                          <span className={assetsStyle.price}>
                            ¥{item.detail.price}
                          </span>
                          <span> x </span>
                          <span className={assetsStyle.count}>
                            {item.detail.sum}
                          </span>
                        </p>
                      </div>
                    </div>
                    <img
                      src={Cut}
                      onClick={() => this.clear(item.id)}
                      alt=""
                      style={{ width: 20, height: 20 }}
                    />
                    <span style={{ fontSize: 16 }}>{item.detail.sum}</span>
                    <img
                      src={Add}
                      onClick={() => {
                        this.addToCart(item);
                      }}
                      alt=""
                      style={{ width: 20, height: 20 }}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={assetsStyle.carNothing}>
              <img src={carNo} alt="" />
              <div className={assetsStyle.carNoText}>购物车空空如也~</div>
            </div>
          )}
        </div>
        <div className={assetsStyle.carBottom}>
          <div>
            <div className={assetsStyle.cartAllcount}>
              {" "}
              <span>{this.props.counter.sumCount}</span>件商品
            </div>
            <div className={assetsStyle.cartAllPrice}>
              总计：
              <span className={assetsStyle.cartprices}>
                ¥{this.props.counter.sumPrice}
              </span>
            </div>
          </div>
          <div className={assetsStyle.cartBottomBtn}>
            <a className={assetsStyle.clearAll} onClick={this.clearAll}>
              清空
            </a>
            <div className={assetsStyle.check} onClick={this.goToPay}>
              去购物车结算
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    counter: state.counter,
  };
};
export default connect(mapStateToProps)(Cart);
