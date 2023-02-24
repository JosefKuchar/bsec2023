import { useParams } from "react-router-dom";

export default function Item() {
  const params = useParams();

  return (
    <div>
      <h1>Item</h1>
    </div>
  );
}
