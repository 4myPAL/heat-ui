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
@Component({
  selector: 'traderBalances',
  inputs: ['currencyInfo','assetInfo'],
  template: `
    <div layout="row" class="trader-component-title">Account&nbsp;
      <span flex></span>
      <elipses-loading ng-show="vm.loading"></elipses-loading>
    </div>
    <md-list>
      <md-list-item class="header">
        <div class="truncate-col symbol-col">Asset</div>
        <div class="truncate-col balance-col right-align" flex>Balance</div>
      </md-list-item>
      <md-virtual-repeat-container  flex layout-fill layout="column" virtual-repeat-flex-helper  class="content">
        <md-list-item md-virtual-repeat="item in vm.balances">
          <div class="truncate-col symbol-col" ng-class="{certified:item.certified}">{{item.symbol}}</div>
          <div class="truncate-col balance-col right-align" ng-class="{certified:item.certified}" flex>{{item.balance}}</div>
        </md-list-item>
      </md-virtual-repeat-container>
    </md-list>
  `
})
@Inject('$scope','heat','user','assetInfo','$q')
class TraderBalancesComponent {

  /* @inputs */
  currencyInfo: AssetInfo; // @input
  assetInfo: AssetInfo; // @input

  balances: Array<IHeatAccountBalance> = [];

  constructor(private $scope: angular.IScope,
              private heat: HeatService,
              private user: UserService,
              private assetInfoService: AssetInfoService,
              private $q: angular.IQService) {
    let ready = () => {
      if (this.currencyInfo && this.assetInfo) {
        /* subscribe to websocket balance changed events */
        var refresh = utils.debounce((angular.bind(this, this.loadBalances)), 1*1000, false);
        heat.subscriber.balanceChanged({account: user.account}, refresh, $scope);

        this.loadBalances();
        unregister.forEach(fn=>{fn()});
      }
    }
    let unregister = [$scope.$watch('vm.currencyInfo',ready),$scope.$watch('vm.assetInfo',ready)];
  }

  loadBalances() {
    this.heat.api.getAccountBalances(this.user.account, "0", 1, 0, 100).then((balances) => {
      this.$scope.$evalAsync(() => {
        var promises = []; // collects all balance lookup promises
        this.balances = balances;
        balances.forEach((balance: IHeatAccountBalance|any) => {
          promises.push(
            this.assetInfoService.getInfo(balance.id).then((info)=>{
              this.$scope.$evalAsync(() => {
                balance.symbol = info.symbol;
                balance.name = info.name;
                balance.certified = info.certified;
              });
            })
          );
          balance.symbol = '*';
          balance.name = '*';
          balance.balance = utils.formatQNT(balance.virtualBalance, balance.decimals).replace(/.00000000$/,'');;
          //balance.balance = utils.formatQNT(balance.balance, balance.decimals);

          if (this.currencyInfo.id == balance.id)
            this.currencyInfo.userBalance = balance.virtualBalance;
          if (this.assetInfo.id == balance.id)
            this.assetInfo.userBalance = balance.virtualBalance;
        });
        this.$q.all(promises).then(()=>{
          this.$scope.$evalAsync(() => {
            balances.sort((a:any,b:any)=> {
              if (a.certified < b.certified) return 1;
              if (a.certified > b.certified) return -1;
              if (a.symbol < b.symbol) return 1;
              if (a.symbol > b.symbol) return -1;
              return 0;
            });
          });
        });
      })
    });
  }
}
