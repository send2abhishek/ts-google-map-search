import axios from "axios";

const formEl = document.querySelector("form")! as HTMLFormElement;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyDMCT_xt8QS9ExtyIyArMnfWXUg7-D0ocU";

declare var google: any;

type GoogleGeoCodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function formSubmitHandler(event: Event) {
  event.preventDefault();
  const enteredAddres = addressInput.value;
  console.log(event, enteredAddres);

  axios
    .get<GoogleGeoCodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddres
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((res) => {
      if (res.data.status != "OK") {
        throw new Error("could not fetch location");
      }
      const coordinates = res.data.results[0].geometry.location;

      // The map, centered at Uluru
      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 12,
          center: coordinates,
        }
      );

      new google.maps.Marker({
        position: coordinates,
        map: map,
      });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

formEl.addEventListener("submit", formSubmitHandler);
