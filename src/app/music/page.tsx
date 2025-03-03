import MusicPage from "./musicpage";

export const metadata = {
    title: "Создание музыки",
    description:
      "Пишу музыку: электроника, джаз, рок, саундтреки для игр и фильмов. Экспериментирую со звуком, делаю музыку на заказ.",
    keywords: [
      "Никита Черепов",
      "музыка",
      "электронная музыка",
      "саундтреки",
      "джаз",
      "блюз",
      "музыка для игр",
      "музыка для фильмов",
      "авторская музыка",
      "музыка на заказ",
      "экспериментальная музыка",
    ],
    openGraph: {
      title: "Создание музыки",
      description:
        "Электроника, джаз-блюз, саундтреки, эксперименты со звуком и музыка на заказ.",
    },
  };
  
  

export default function Music() {
    return <MusicPage/>
}