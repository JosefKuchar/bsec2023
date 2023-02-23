import { List, ListItemButton, ListItemText, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "./Navigation";

export default function Items() {
  const { id } = useParams();
  const navigate = useNavigate();

  const restaurants = [
    { name: "Jojou", id: 1 },
    { name: "Blbabdaf", id: 2 },
  ];

  return (
    <>
      <h1>{id}</h1>
      <List>
        {restaurants.map((item) => (
          <>
            <ListItemButton
              onClick={() => navigate(`/places/${id}/${item.id}`)}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
            <Divider />
          </>
        ))}
      </List>
      <Navigation />
    </>
  );
}
