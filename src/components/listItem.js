import React from "react";
import { connect } from "dva";
import { Radio } from "antd";
import styles from "./index.less";

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSize: this.props.item.detail.sizes[0],
    };
  }
  componentDidMount() {}
  handleSizeChange = (e, id) => {
    console.log("选择的尺寸", e.target.value);
    this.setState({ currentSize: e.target.value });
    // let info = { id, size: e.target.value };
    // this.props.dispatch({ type: "counter/changeSize", info });
  };
  addToCart = (info) => {
    this.props.dispatch({
      type: "counter/sendCar",
      info,
      currentSize: this.state.currentSize,
    });
  };
  render() {
    // console.log("购物车数据", this.props.counter);
    const { item } = this.props;
    return (
      <li key={item.id} className={styles.productLi}>
        <img className={styles.clothImg} src={item.detail.imgBig} alt="cloth" />
        <p className={styles["product-name"]}>
          <span>{item.detail.title}</span>
          {/* <span className="p-size">S-XL</span> */}
        </p>
        <a href="javascript" className={styles["product-subName"]}>
          {item.detail.subTitle}
        </a>
        <div style={{ margin: "10px 0" }}>
          <Radio.Group
            defaultValue={this.state.currentSize || item.detail.currentSize}
            // value={this.state.currentSize}
            onChange={(e) => {
              this.handleSizeChange(e, item.id);
            }}
          >
            {item.detail.sizes.map((h) => {
              return (
                <Radio.Button value={h} key={item.id + Math.random()}>
                  {h}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
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
  }
}

ListItem.propTypes = {};
const mapStateToProps = (state) => {
  return {
    counter: state.counter,
  };
};
export default connect(mapStateToProps)(ListItem);
