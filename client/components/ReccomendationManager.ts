import { createHelia } from "helia";
import { strings } from "@helia/strings";
import { createCipher } from "crypto";
import axios from "axios";
import UserData from "./UserData";
import { backendURL } from "../settings";

export default class ReccomendationManager {
  static EMBEDDING_DIMENSIONS: number = 384;
  static N_EMBEDDINGS: any[] = [];
  static TIME_WEIGHT_COEFFICIENT: number = 1.4;
  static POPULARITY_WEIGHT_COEFFICIENT: number = 0.01;
  static HELIA_ID: string = "";
  static E_PASSWORD: string = "";

  static init = () => {
    const n_embeddings: any[] = JSON.parse(
      localStorage.getItem("LIP_KIB") || "[]"
    );
    const helia_id = localStorage.getItem("___");
    const pass = localStorage.getItem("dat");

    this.N_EMBEDDINGS = n_embeddings;
    this.HELIA_ID = helia_id || "";
    this.E_PASSWORD = pass || "";
    UserMLProfile.init(n_embeddings);
  };

  static add_embeddings = async (payload) => {
    // Calculate weight of point
    const weight = this.calculate_weight(payload);
    this.N_EMBEDDINGS.push({ ...payload, weight: weight });
    this.save_json();

    // We need to add the data to ipfs, so init a helia node
    const helia = await createHelia();
    const s = strings(helia);

    // Create IPFS buf
    const ipfs_object = {
      userID: UserData.getData("_id"),
      email: UserData.getData("email"),
      data: this.N_EMBEDDINGS,
      toc: new Date(Date.now()).toISOString(),
    };
    // console.log(ipfs_object);
    const str_obj = JSON.stringify(ipfs_object);

    // Now, we encrypt using our E_PASSWORD
    const cipher = createCipher("aes256", this.E_PASSWORD);
    const ipfs_data_encrypted =
      cipher.update(str_obj, "utf8", "hex") + cipher.final("hex");

    // Send to helia
    const myImmutableAddress = await s.add(ipfs_data_encrypted);
    const helia_id: string = myImmutableAddress.toString();
    localStorage.setItem("___", helia_id);

    // Send request to our backend (to make sure if in the future we need the data we can get it)
    const res_2 = await axios.post(backendURL + "/create/helia", {
      id: UserData.getData("_id"),
      helia: helia_id,
    });
    console.log(res_2);
    // const f = await s.get(CID.parse(helia_id));
    await helia.stop();
  };

  static save_json = () => {
    localStorage.setItem("LIP_KIB", JSON.stringify(this.N_EMBEDDINGS));
  };

  static find_center = () => {
    // Add all of the numbers, in all of the dimensions
    const return_embeddings = [];

    // Loop
    for (let i = 0; i < this.EMBEDDING_DIMENSIONS; i++) {
      let e = 0;
      for (let j = 0; j < this.N_EMBEDDINGS.length; j++) {
        e += this.N_EMBEDDINGS[j]["embeddings"][i];
      }
      return_embeddings.push(e / this.N_EMBEDDINGS.length);
    }

    return return_embeddings;
  };

  static find_weighted_center = () => {
    // Add all of the numbers, in all of the dimensions
    const return_embeddings = [];

    // Loop
    for (let i = 0; i < this.EMBEDDING_DIMENSIONS; i++) {
      let e = 0;
      let f = 0;
      for (let j = 0; j < this.N_EMBEDDINGS.length; j++) {
        f += this.N_EMBEDDINGS[j]["weight"];
        e +=
          this.N_EMBEDDINGS[j]["embeddings"][i] *
          this.N_EMBEDDINGS[j]["weight"];
      }
      return_embeddings.push(e / f);
    }

    return return_embeddings;
  };

  static calculate_weights = () => {
    const new_nodes = [];
    for (let it = 0; it < this.N_EMBEDDINGS.length; it++) {
      let embedding = this.N_EMBEDDINGS[it];
      embedding["weight"] = this.calculate_weight(embedding);
      new_nodes.push(embedding);
    }
    return new_nodes;
  };

  static calculate_weight = (node) => {
    // Calculates the weight for each node in the network
    return (
      (node.toc / Date.now()) * this.TIME_WEIGHT_COEFFICIENT +
      node.popularity * this.POPULARITY_WEIGHT_COEFFICIENT
    );
  };

  static remove_embedding_metadata = () => {
    const remove_array: number[][] = [];
    for (let i = 0; i < this.N_EMBEDDINGS.length; i++) {
      remove_array.push(this.N_EMBEDDINGS[i]["embeddings"]);
    }
    return remove_array;
  };

  static only_embedding_meta_data = () => {
    const new_embeddings = [...this.N_EMBEDDINGS];
    for (let o = 0; o < new_embeddings.length; o++) {
      const obj = new_embeddings[o];
      delete obj["embeddings"];
    }
    return new_embeddings;
  };

  static chroma_predict = async () => {
    // We need to send both our weighted center AND all of our embeddings
    const centre = this.find_weighted_center();

    // Now, send request to our ML backend
    const url = `http://localhost:1010/query/byEmbeddings`;
    const payload = {
      centre: centre,
      embeddings: this.N_EMBEDDINGS,
      n: {
        centre: 10,
        embeddings: 2,
      },
    };
    const res = await axios.post(url, payload);
    console.log(res);
    return res.data;
  };
}

export class UserMLProfile {
  static N_DOCS : any[] = [];

  static init = (docs : any[]) => {
    this.N_DOCS = docs;
  }

  static run = () => {
    // First, perform some basic tokenization and stop word elimination
    
  }
}
