import { createHelia } from "helia";
import { CID } from "multiformats/cid";
import { Strings, strings } from "@helia/strings";
import { mlURL } from "../settings";
import axios from "axios";

export default class ReccomendationManager {
  static EMBEDDING_DIMENSIONS: number = 384;
  static N_EMBEDDINGS: any[] = [];
  static TIME_WEIGHT_COEFFICIENT: number = 1.4;
  static POPULARITY_WEIGHT_COEFFICIENT: number = 0.01;

  static init = () => {
    const n_embeddings: any[] = JSON.parse(
      localStorage.getItem("LIP_KIB") || "[]"
    );
    this.N_EMBEDDINGS = n_embeddings;
  };

  static add_embeddings = (payload) => {
    // Calculate weight of point
    const weight = this.calculate_weight(payload);
    this.N_EMBEDDINGS.push({ ...payload, weight: weight });
    console.log(this.N_EMBEDDINGS);

    // TODO : helia
    this.save_json();
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

  static chroma_predict = async () => {
    // We need to send both our weighted center AND all of our embeddings
    const centre = this.find_weighted_center();
    // Now, send request to our ML backend
    const url = `http://localhost:1010/query/byEmbeddings`;
    console.log(url);
    const res = await axios.post(url, {centre : centre});
    console.log(res);
    return res.data;
  };
}
