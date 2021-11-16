import React from "react";
import top from '../assets/arrow.png';
import assetsStyle from "./index.css";

class FLoatNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {show:false};
  }
  componentDidMount(){
    window.addEventListener('scroll',this.handleScroll,true);
  }
  handleScroll=()=>{
    let scrollTop = document.documentElement.scrollTop;
    if(scrollTop>100){
      this.setState({
        show:true
      });
    }else{
      this.setState({
        show:false
      });
    }
  }
  backTop=()=>{
    document.documentElement.scrollTop=0;
  }
  render() {
    return <div className={assetsStyle.hTop} onClick={this.backTop}>
      <img src={top} alt='top'/>
      <span>TOP</span>
    </div>;
  }
}
export default FLoatNav;