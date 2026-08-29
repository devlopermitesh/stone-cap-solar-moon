import { useInterview } from "@/lib/interview-store";
import { DsaHome } from "./DsaHome";
import { DsaCalendar } from "./DsaCalendar";
import { DsaToday } from "./DsaToday";
import { VideoPlayer } from "./VideoPlayer";
import { ProblemsList } from "./ProblemsList";

export function DsaApp() {
  const dsaScreen = useInterview((s) => s.dsaScreen);
  const selectedDay = useInterview((s) => s.selectedDay);

  switch (dsaScreen) {
    case "calendar":
      return <DsaCalendar />;
    case "today":
      return <DsaToday />;
    case "playlist":
      return <VideoPlayer week={Math.floor((selectedDay ?? 0) / 7)} />;
    case "video":
      return <VideoPlayer week={Math.floor((selectedDay ?? 0) / 7)} />;
    case "problems":
      return <ProblemsList />;
    case "home":
    default:
      return <DsaHome />;
  }
}
