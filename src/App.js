import { Provider } from "react-redux";
import store from "./store/store";
import JudgmentApp from "./Containers/JudgmentApp/JudgmentApp";

export default function App() {
	return (
		<Provider store={store}>
			<JudgmentApp />
		</Provider>
	);
}
