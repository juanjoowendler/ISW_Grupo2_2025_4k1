import { useLocation } from "react-router-dom";
import PostInscripcion from "../components/PostInscripcion";
import "../styles/PostInscripcion.css";

export default function PostInscripcionView() {
  const location = useLocation();
  const datos = location.state; // <-- Esto recupera los datos pasados con navigate()

  return (
    <div className="postinscripcion-view">
      <PostInscripcion datos={datos} />
    </div>
  );
}

