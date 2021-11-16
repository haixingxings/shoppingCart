import dva from "dva";
import "antd/dist/antd.css";
// import zhCN from 'antd/es/locale/zh_CN';
// import {createBrowserHistory as createHistory} from 'history';
import "./index.css";

// 1. Initialize
const app = dva(
//   {
//   history:createHistory()
// }
);

// 2. Plugins
// app.use({});

// 3. Model
app.model(require("./models/counter").default);

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
