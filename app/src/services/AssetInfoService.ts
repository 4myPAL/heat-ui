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
interface AssetInfo {
  id: string;
  description: string;
  descriptionUrl: string;
  decimals: number;
  symbol: string;
  name: string;
}

interface AssetPropertiesProtocol1 {
  symbol: string;
  name: string;
}

@Service('assetInfo')
@Inject('heat', '$q')
class AssetInfoService {

  cache: IStringHashMap<AssetInfo> = {};

  constructor(private heat: HeatService, private $q: angular.IQService) {
    this.cache["0"] = {
      id: "0",
      description: "HEAT Cryptocurrency",
      descriptionUrl: "",
      decimals: 8,
      symbol: "HEAT",
      name: "HEAT"
    };
  }

  hasInfo(asset: string): boolean {
    return angular.isDefined(this.cache[asset]);
  }

  getInfoSync(asset: string): AssetInfo {
    return this.cache[asset];
  }

  getInfo(asset: string): angular.IPromise<AssetInfo> {
    var deferred = this.$q.defer();
    if (this.hasInfo(asset)) {
      deferred.resolve(this.getInfoSync(asset));
    }
    else {
      this.lookupInfo(asset).then(deferred.resolve, deferred.reject);
    }
    return deferred.promise;
  }

  lookupInfo(asset: string): angular.IPromise<AssetInfo> {
    var deferred = this.$q.defer();
    if (asset == "0") {
      deferred.resolve({
        id: asset,
        description: "HEAT",
        descriptionUrl: "",
        decimals: 8,
        symbol: "HEAT",
        name: "HEAT"
      });
    }
    else {
      this.heat.api.getAssetProperties(asset, "0", 1).then((data) => {
        var properties = this.parseProperties(data.properties, {
          symbol: asset.substring(0, 4),
          name: asset
        })
        deferred.resolve({
          id: asset,
          description: "should hold description",
          descriptionUrl: data.descriptionUrl,
          decimals: data.decimals,
          symbol: properties.symbol,
          name: properties.name
        });
      }, deferred.reject);
    }
    //this.cache[asset] = ret;
    //deferred.resolve(ret);
    return deferred.promise;
  }

  public parseProperties(properties: string, fallback: AssetPropertiesProtocol1): AssetPropertiesProtocol1 {
    try {
      var json = JSON.parse(properties);
      return {
        symbol: json[0],
        name: json[1]
      };
    } catch (e) {
      //console.error(e);
    }
    return fallback;
  }

  public stringifyProperties(properties: AssetPropertiesProtocol1) {
    return JSON.stringify([properties.symbol, properties.name]);
  }
}