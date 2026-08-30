import { useInterview } from "@/lib/interview-store";
import { EnglishHome } from "./EnglishHome";
import { EnglishCalendar } from "./EnglishCalendar";
import { EnglishToday } from "./EnglishToday";
import { EnglishPlaylist } from "./EnglishPlaylist";

export function EnglishApp() {
  const englishScreen = useInterview((s) => s.englishScreen);
  const selectedDay = useInterview((s) => s.selectedDay);

  switch (englishScreen) {
    case "calendar":
      return <EnglishCalendar />;
    case "today":
      return <EnglishToday />;
    case "playlist":
      return <EnglishPlaylist week={Math.floor((selectedDay ?? 0) / 7)} />;
    case "video":
      return <EnglishPlaylist week={Math.floor((selectedDay ?? 0) / 7)} />;
    case "home":
    default:
      return <EnglishHome />;
  }
}
