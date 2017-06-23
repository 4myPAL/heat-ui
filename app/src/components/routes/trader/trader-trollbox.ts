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
  selector: 'traderTrollbox',
  template: `
    <div layout="column" flex layout-fill>
      <div class="trader-component-title">Trollbox&nbsp;
        <elipses-loading ng-show="vm.loading"></elipses-loading>
        <a href="https://heatslack.herokuapp.com/" target="_blank">Join Slack!
          <md-tooltip md-direction="bottom">
            This trollbox is connected to our Slack #trollbox channel, post either here or on #trollbox and chat in realtime.
          </md-tooltip>
        </a>
      </div>
      <div ng-if="!vm.trollbox.name && vm.user.unlocked" class="join-area" layout="row">
        <div flex>
          <input type="text" placeholder="Type your name here" ng-model="vm.name"></input>
        </div>
        <div>
          <button class="md-primary md-button md-ink-ripple" ng-click="vm.joinChat()" ng-disabled="!vm.name">Join</button>
        </div>
      </div>
      <div flex layout="column">
        <ul scroll-glue class="display" ng-class="{'notLoggedIn':vm.user.unlocked === false}" flex>
          <li ng-repeat="item in vm.messages">
            <span><b>{{item.username}}</b>: {{item.text}}</span>
          </li>
        </ul>
      </div>
      <div ng-if="vm.user.unlocked" layout="row">
        <div flex ng-if="vm.trollbox.name">
          <textarea rows="2" ng-keypress="vm.onTextAreaKeyPress($event)"
            placeholder="ENTER to send, SHIFT+ENTER for new line" ng-model="vm.messageText"></textarea>
        </div>
      </div>
    </div>
  `
})
@Inject('$scope','trollbox','$timeout','user')
class TraderTrollboxComponent {
  private name: string;
  private messageText: string;
  public messages: Array<TrollboxServiceMessage> = [];
  constructor(private $scope: angular.IScope,
              private trollbox: TrollboxService,
              private $timeout: angular.ITimeoutService,
              private user: UserService) {
    trollbox.getMessages().then((messages) => {
      $scope.$evalAsync(() => {
        this.messages = messages;
      });
    });
    trollbox.subscribe((event)=> {
      $scope.$evalAsync(() => {
        if (angular.isObject(event) && angular.isString(event.username) && angular.isString(event.text)) {
          if (event.username.length > 0 && event.text.length > 0) {
            this.messages.push(event);
          }
        }
      });
    }, $scope);
  }

  joinChat() {
    this.trollbox.join(this.name);
  }

  onTextAreaKeyPress($event: KeyboardEvent) {
    if ($event.keyCode == 13 && !$event.shiftKey) {
      this.trollbox.sendMessage(this.messageText).then(()=>{
        this.$scope.$evalAsync(()=>{
          this.messageText = "";
        })
      })
    }
  }
}
