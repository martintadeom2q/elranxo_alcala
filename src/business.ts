/** Only user-supplied identities and links; do not invent menu items or contact details. */
export const business = {
  name: "El Ranxo",
  city: "Alcalá de Henares",
  instagram: "https://www.instagram.com/elranxo_alcala/",
  maps: "https://maps.app.goo.gl/di6EgPZXdHFrGjwb9",
  // Add these only after the business confirms them. The UI omits missing fields.
  address: "" as string,
  phone: "" as string,
  hours: "" as string,
  legalName: "",
  taxId: "",
  platforms: [
    {
      id: "uber",
      name: "Uber Eats",
      short: "Uber",
      url: "https://www.ubereats.com/es/store/el-ranxo-alcala-de-henares/mJNAHg0nURutJxW-drpqnw",
      description: "Consulta la carta y pide con Uber Eats.",
      color: "#d7192b",
    },
    {
      id: "justeat",
      name: "Just Eat",
      short: "Just Eat",
      url: "https://www.just-eat.es/restaurants-elrancho-smashburger-alcaladehenares/menu",
      description: "Encuentra tu pedido en Just Eat.",
      color: "#d7192b",
    },
    {
      id: "glovo",
      name: "Glovo",
      short: "Glovo",
      url: "https://glovoapp.com/es/es/alcala-de-henares-y-torrejon-de-ardoz/stores/ranxo-king-smash-burger-alcala-de-henares-y-torrejon-de-ardoz",
      description: "Elige lo que te apetece en Glovo.",
      color: "#d7192b",
    },
  ],
} as const;
