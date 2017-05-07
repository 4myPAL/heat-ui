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
/*
      <!--
      <div layout="column" flex>
        <md-tabs md-border-bottom flex layout="column">
          <md-tab label="BLOCKS" flex layout="column">
            <md-content class="md-padding" flex layout="column">
              <blocks-explorer-table layout="column" flex></blocks-explorer-table>
            </md-content>
          </md-tab>
          <md-tab label="TRANSACTIONS" flex layout="column">
            <md-content class="md-padding" flex layout="column">
              <transactions-explorer-table layout="column" flex></transactions-explorer-table>
            </md-content>
          </md-tab>
        </md-tabs>
      </div>
      -->
*/
@RouteConfig('/explorer')
@Component({
  selector: 'explorer',
  styles: [`
    explorer h3 {
      font-size: 24px !important;
      font-weight: bold;
      padding-bottom: 0px;
      margin-bottom: 0px;
    }
    explorer h3.below {
      padding-top: 0px;
      margin-top: 6px;
    }
    explorer .header {
      font-weight: bold !important;
      color: #616161 !important;
    }
    explorer .truncate-col {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    explorer md-list-item {
      min-height: 25px;
      height: 25px;
      border-bottom: 1px solid #ddd;
    }
    explorer md-list-item .md-button {
      min-height: 24px;
    }
    explorer .right-align {
      text-align: right;
    }
    explorer md-list-item.active {
      background-color: #B2DFDB;
    }
    explorer md-list-item {
      min-height: 25px;
      height: 25px;
    }
    explorer .wallet {
      height: 32px;
    }
  `],
  template: `
    <div layout="column" flex layout-padding layout-fill>
      <h3 class="below">Search&nbsp;&nbsp;&nbsp;<img src="assets/heatwallet.png" class="wallet"></h3>
      <explorer-search layout="column"></explorer-search>
      <h3 class="below">Latest Blocks</h3>
      <explorer-latest-blocks layout="column" flex="30"></explorer-latest-blocks>
      <h3 class="below">Latest Transactions</h3>
      <explorer-transactions layout="column" flex="60"></explorer-transactions>
    </div>
  `
})
@Inject('$scope')
class ExplorerComponent {
  constructor(private $scope: angular.IScope) {
  }
}