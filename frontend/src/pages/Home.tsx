import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="justify-center flex h-screen">
      {t("noContentRoot", "No content on Root Page.")}
    </div>
  );
};

export default Home;