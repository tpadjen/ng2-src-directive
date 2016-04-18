import './spec-setup';
import {
  expect,
  it, iit, xit,
  describe,
  inject,
  injectAsync,
  fakeAsync,
  TestComponentBuilder,
  beforeEach,
  beforeEachProviders,
} from 'angular2/testing';
import {
  MockBackend,
  MockConnection
} from 'angular2/http/testing';
import {
  Http,
  BaseRequestOptions,
  Response,
  ResponseOptions
} from 'angular2/http';
import {
  Component,
  provide,
  AppViewManager,
  Injector,
  ViewChild
} from 'angular2/core';
import {
  SrcDirective
} from '../src/src.directive';

const mockHttpProvider = {
  deps: [MockBackend, BaseRequestOptions],
  useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
    return new Http(backend, defaultOptions);
  }
};

// Component for testing
@Component({
  selector: 'sourced',
  template: `<div [src]="source" #el></div>`,
  directives: [SrcDirective]
})
class Sourced {
  source: string = "";
  @ViewChild('el') el;
}


export function main() {

  describe('Source Directive', () => {

    beforeEachProviders(() => [
      TestComponentBuilder,
      MockBackend,
      BaseRequestOptions,
      provide(Http, mockHttpProvider)
    ]);

    describe('empty sources', () => {

      it('should not request a null source',
        injectAsync([TestComponentBuilder, Http], (tcb, http) => {
          return new Promise(resolve => {
            tcb.createAsync(Sourced).then(fixture => {
              spyOn(http, 'get').and.callThrough;

              fixture.componentInstance.source = null;
              fixture.detectChanges();

              setTimeout(() => {
                expect(http.get).not.toHaveBeenCalled();
                resolve();
              }, 100);
            });
          });
        }), 200
      );

      it('should not request an undefined source',
        injectAsync([TestComponentBuilder, Http], (tcb, http) => {
          return new Promise(resolve => {
            tcb.createAsync(Sourced).then(fixture => {
              spyOn(http, 'get').and.callThrough;

              fixture.componentInstance.source = undefined;
              fixture.detectChanges();

              setTimeout(() => {
                expect(http.get).not.toHaveBeenCalled();
                resolve();
              }, 100);
            });
          });
        }), 200
      );

      it('should not request an empty source',
        injectAsync([TestComponentBuilder, Http], (tcb, http) => {
          return new Promise(resolve => {
            tcb.createAsync(Sourced).then(fixture => {
              spyOn(http, 'get').and.callThrough;

              fixture.componentInstance.source = '';
              fixture.detectChanges();

              setTimeout(() => {
                expect(http.get).not.toHaveBeenCalled();
                resolve();
              }, 100);
            });
          });
        }), 200
      );

      it('should not request source without a file extension',
        injectAsync([TestComponentBuilder, Http], (tcb, http) => {
          return new Promise(resolve => {
            tcb.createAsync(Sourced).then(fixture => {
              spyOn(http, 'get').and.callThrough;

              fixture.componentInstance.source = 'source';
              fixture.detectChanges();

              setTimeout(() => {
                expect(http.get).not.toHaveBeenCalled();
                resolve();
              }, 100);
            });
          });
        }), 200
      );
    });

    describe('sourcable interface', () => {

      describe('sourceChanged', () => {

        it('should notify sourceChanged when source changed',
          injectAsync([TestComponentBuilder, MockBackend],
          (tcb, backend) => {
            return new Promise(resolve => {
              tcb.createAsync(Sourced).then(fixture => {
                // respond to http request
                backend.connections.subscribe(connection => {
                  connection.mockRespond(new Response(new ResponseOptions({body: 'My text'})));
                });

                // setup component so el is found as ViewChild
                fixture.detectChanges();

                // Listen for sourceChanged
                let el = fixture.componentInstance.el;
                el.sourceChanged = function() {};
                spyOn(el, 'sourceChanged');

                // change the source
                fixture.componentInstance.source = 'remote.html';
                fixture.detectChanges();

                setTimeout(() => {
                  expect(el.sourceChanged).toHaveBeenCalledWith('remote.html');
                  resolve();
                }, 100);

              });
            });
          }), 200
        );

      });

      describe('sourceLoading', () => {

        it('should notify sourceLoading when source loading',
          injectAsync([TestComponentBuilder, MockBackend],
          (tcb, backend) => {
            return new Promise(resolve => {
              tcb.createAsync(Sourced).then(fixture => {
                // respond to http request
                backend.connections.subscribe(connection => {
                  connection.mockRespond(new Response(new ResponseOptions({body: 'My text'})));
                });

                // setup component so el is found as ViewChild
                fixture.detectChanges();

                // Listen for sourceLoading
                let el = fixture.componentInstance.el;
                el.sourceLoading = function() {};
                spyOn(el, 'sourceLoading');

                // change the source
                fixture.componentInstance.source = 'remote.html';
                fixture.detectChanges();

                setTimeout(() => {
                  expect(el.sourceLoading).toHaveBeenCalledWith('remote.html');
                  resolve();
                }, 100);

              });
            });
          }), 200
        );

      });


      describe('sourceError', () => {

        it('should notify sourceError when source not a file',
          injectAsync([TestComponentBuilder, MockBackend],
          (tcb, backend) => {
            return new Promise(resolve => {
              tcb.createAsync(Sourced).then(fixture => {
                // setup component so el is found as ViewChild
                fixture.detectChanges();

                // Listen for sourceError
                let el = fixture.componentInstance.el;
                el.sourceError = function() {};
                spyOn(el, 'sourceError');

                // change the source
                fixture.componentInstance.source = 'remote';
                fixture.detectChanges();

                setTimeout(() => {
                  expect(el.sourceError).toHaveBeenCalledWith({message: 'remote is not a file.'});
                  resolve();
                }, 100);

              });
            });
          }), 200
        );

        it('should notify sourceError when source not found',
          injectAsync([TestComponentBuilder, MockBackend],
          (tcb, backend) => {
            return new Promise(resolve => {
              tcb.createAsync(Sourced).then(fixture => {
                // respond to http request
                backend.connections.subscribe(connection => {
                  connection.mockError(new Response(new ResponseOptions({body: '', status: 404})));
                });

                // setup component so el is found as ViewChild
                fixture.detectChanges();

                // Listen for sourceError
                let el = fixture.componentInstance.el;
                el.sourceError = function() {};
                spyOn(el, 'sourceError');

                // change the source
                fixture.componentInstance.source = 'remote.html';
                fixture.detectChanges();

                setTimeout(() => {
                  expect(el.sourceError).toHaveBeenCalledWith({message: 'remote.html not found.'});
                  resolve();
                }, 100);

              });
            });
          }), 200
        );

      });

      describe('sourceReceived', () => {

        it('should notify when source received if method exists',
          injectAsync([TestComponentBuilder, MockBackend],
          (tcb, backend) => {
            return new Promise(resolve => {
              tcb.createAsync(Sourced).then(fixture => {
                // respond to http request
                backend.connections.subscribe(connection => {
                  connection.mockRespond(new Response(new ResponseOptions({body: 'My text'})));
                });

                // setup component so el is found as ViewChild
                fixture.detectChanges();

                // Listen for sourceReceived
                let el = fixture.componentInstance.el;
                el.sourceReceived = function() {};
                spyOn(el, 'sourceReceived');

                // change the source
                fixture.componentInstance.source = 'remote.html';
                fixture.detectChanges();

                setTimeout(() => {
                  expect(el.sourceReceived).toHaveBeenCalled();
                  expect(el.sourceReceived.calls.mostRecent().args[0].text()).toEqual('My text');
                  resolve();
                }, 100);

              });
            });
          }), 200
        );

        it('should set innerHTML when source received if method does not exist',
        injectAsync([TestComponentBuilder, MockBackend],
          (tcb, backend) => {
            return new Promise(resolve => {
              tcb.createAsync(Sourced).then(fixture => {
                // respond to http request
                backend.connections.subscribe(connection => {
                  connection.mockRespond(new Response(new ResponseOptions({body: 'My text'})));
                });

                // setup component so el is found as ViewChild
                fixture.detectChanges();

                let el = fixture.componentInstance.el;

                // change the source
                fixture.componentInstance.source = 'remote.html';
                fixture.detectChanges();

                setTimeout(() => {
                  expect(el.nativeElement.innerHTML).toEqual('My text');
                  resolve();
                }, 100);

              });
            });
          }), 200
        );

      });

    });

  });
}
