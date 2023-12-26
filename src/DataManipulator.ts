// Import the ServerRespond type from the DataStreamer module.
import { ServerRespond } from './DataStreamer';

// Define the Row interface to structure the data for the visualization with new fields.
export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

// Create a class that will handle data manipulation logic.
export class DataManipulator {
  // Define a static method to generate a Row object from an array of ServerRespond objects.
  static generateRow(serverRespond: ServerRespond[]): Row {
    // Calculate the average price for stock 'abc' by averaging the top ask and bid prices.
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    // Calculate the average price for stock 'def' in the same manner.
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    // Calculate the ratio of the two average prices.
    const ratio = priceABC / priceDEF;
    // Adjust the upper and lower bounds for the ratio to be 10% above and below 1, which is a change from the previous 5%.
    const upperBound = 1 + 0.10; // Increased from the initial 0.05
    const lowerBound = 1 - 0.10; // Increased from the initial 0.05
    // Return a new Row object with the calculated values and decide if a trigger alert should be activated based on the ratio.
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      // Choose the later timestamp between the two server responses.
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ? 
        serverRespond[0].timestamp : serverRespond[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      // Set the trigger_alert to the ratio if it exceeds the bounds, otherwise leave it undefined.
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}
/* In these updates to the DataManipulator.ts file, the thought process was to restructure the data into
 a new Row interface that is better suited to the updated visualization needs. The focus is on calculating 
 a price ratio and determining if this ratio falls outside of newly adjusted bounds, which have been expanded
  from a 5% margin to a 10% margin around the value of 1. This change would allow for a broader range of 
  fluctuation before triggering an alert. */

/* After applying the changes from the patch file, the realization was that increasing the threshold for 
the upper and lower bounds to 10% might make the bounds too large, potentially allowing for more significant 
fluctuations in the ratio without triggering an alert. This could mean that smaller but potentially important
 variations in the ratio might not be captured or highlighted, suggesting that a narrower margin might be more
  sensitive and effective for certain analytical purposes. The process of adjusting these values and observing
   their impact on the data visualization would have provided valuable insight into how to fine-tune such 
   parameters for different analytical needs. */