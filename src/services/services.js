import axios from "axios";

export async function getFloorPriceService() {
  try {
    const response = await axios({
      method: "get",
      url: `https://jpeg.cash/api/pricing?id=XUEKO-XHDKE-HIGHE`,
      withCredentials: false,
    });
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.log("axios error - ", e);
  }
}
