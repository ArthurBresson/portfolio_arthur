import DashboardApp from "./components/dashboard/DashboardApp.jsx";
import MobileApp from "./components/mobile/MobileApp.jsx";
import { useMediaQuery } from "./hooks/useMediaQuery.js";

// Une version par écran, dans le thème dessiné à la main :
// - ordinateur : le dashboard 3×3 sans scroll ;
// - téléphone et petite tablette : une page qui défile, avec un menu
//   burger et des sections numérotées.
// La limite suit celle du dashboard (900 px) : en dessous, sa grille ne
// tient plus. Les anciens liens ?v=… s'ouvrent simplement sur la bonne
// version pour l'écran.
const MOBILE_QUERY = "(max-width: 899px)";

function App() {
  const mobile = useMediaQuery(MOBILE_QUERY);
  return (
    <div className={`app app--${mobile ? "mobile" : "dashboard"}`}>
      {mobile ? <MobileApp /> : <DashboardApp />}
    </div>
  );
}

export default App;
