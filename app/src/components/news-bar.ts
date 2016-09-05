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
  selector: 'newsBar',
  styles: [`
    news-bar > div {
      padding-top: 30px;
      padding-bottom: 30px;
    }
  `],
  template: `
    <div layout="column" flex>
      <span class="md-title">HEAT ICO claim process available!</span>
      <span class="md-subhead">2016-09-03</span>
      <br>
      <span><a href="#/claim">Click to claim HEAT ICO tokens</a></span>
    </div>
  `
})
@Inject('$scope','user','$mdBottomSheet','$location','$rootScope')
class NewsBarComponent {
  constructor(private $scope: angular.IScope,
              private user: UserService,
              private $mdBottomSheet: angular.material.IBottomSheetService,
              private $location: angular.ILocationService,
              private $rootScope: angular.IRootScopeService) {
    $rootScope.$on('$locationChangeSuccess', () => {
      this.$mdBottomSheet.hide(true);
    });
  }
}

heat.Loader.run(['$mdBottomSheet',
  ($mdBottomSheet: angular.material.IBottomSheetService) => {
    window['showNewsBar'] = function ($event) {
      $mdBottomSheet.show({
        template: `
          <md-bottom-sheet class="md-grid" layout="column">
            <div ng-cloak layout="column" flex layout-fill>
              <news-bar layout="column" flex></news-bar>
            </div>
          </md-bottom-sheet>
        `,
        controller: function () {},
        targetEvent: $event
      })
    }
  }
]);