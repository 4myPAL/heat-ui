/*
 * The MIT License (MIT)
 * Copyright (c) 2016 Heat Ledger Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */

@Service('ordersProviderFactory')
@Inject('heat','$q')
class OrdersProviderFactory  {
  constructor(private heat: HeatService, private $q: angular.IQService) {}

  public createProvider(currency: string, asset: string, account?: string, isAsk?: boolean): IPaginatedDataProvider {
    return new OrdersProvider(currency, asset, account, isAsk, this.heat, this.$q);
  }
}

class OrdersProvider implements IPaginatedDataProvider {

  constructor(private currency: string,
              private asset: string,
              private account: string,
              private isAsk: boolean,
              private heat: HeatService,
              private $q: angular.IQService) {}

  /* The number of items available */
  public getPaginatedLength(): angular.IPromise<number> {
    if (this.account) {
      return this.heat.api.getAccountPairOrdersCount(this.account,this.currency,this.asset);
    }
    else if (this.isAsk) {
      return this.heat.api.getAskOrdersCount(this.currency,this.asset);
    }
    return this.heat.api.getBidOrdersCount(this.currency,this.asset);
  }

  /* Returns results starting at firstIndex and up to and including lastIndex */
  public getPaginatedResults(firstIndex: number, lastIndex: number): angular.IPromise<Array<IHeatOrder>> {
    if (this.account) {
      return this.heat.api.getAccountPairOrders(this.account,this.currency,this.asset,firstIndex,lastIndex);
    }
    else if (this.isAsk) {
      return this.heat.api.getAskOrders(this.currency,this.asset,firstIndex,lastIndex);
    }
    return this.heat.api.getBidOrders(this.currency,this.asset,firstIndex,lastIndex);
  }
}



