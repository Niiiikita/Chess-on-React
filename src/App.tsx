// import { setupInitialBoard } from "./utils/setupInitialBoard/setupInitialBoard";
import CustomChessBoard from "./components/CustomChessBoard/CustomChessBoard";
import styles from "./App.module.css";

export default function App() {
  // setupInitialBoard();
  return (
    <div className={styles.App}>
      <CustomChessBoard>
        <p>Фигуры расставлены!</p>
      </CustomChessBoard>
    </div>
  );
}
