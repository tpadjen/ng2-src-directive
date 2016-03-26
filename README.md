# ng2-src-directive

An Angular2 directive for fetching the source of an element from a remote.

## Source Directive

The `Source` directive fetches the url provided and sets the `innerHtml` of the element to which it is attached to the text of the response.

### Usage

In your component that will use src import the `Source` directive. Include `Source` in the component's `directives` array. Add the src attribute to an element inside your template.

```ts
import {Source} from 'ng2-src-directive/src';

@Component({
  selector: 'my-component'
  directives: [Source],
  template: [`
    <p src="my/remote/source.html"></p>
    <div [src]="mySource"></div>
  `]
})
export class MyComponent {
  mySource: string = 'some/other/source.txt';
  ...
}
```

## Lifecycle Events

Several lifecycle hooks are provided to allow your component to respond to source lifecycle events with more granularity. The available hooks are:

* `sourceChanged(url: string)`: The value of the src attribute has changed, kicking off validation and fetching of the remote resource.
* `sourceLoading(url: string)`: The src attribute has been validated (not null) and the resource is being fetched
* `sourceError(string)`: An error occured while fetching the file, such as `file not found`.
* `sourceReceived(Response)`: The source was fetched successfully. the `Response` is the result from the angular2 `Http` get.

All hooks are optional. If `sourceReceived` is provided, the source directive will not automatically set the innerHtml of the element to the reponse text. It is your responsibility and prerogative to handle the response.

### Usage

In your component that will use src import the `Source` directive, optionally the `Sourcable` interface, and the `Response` you will receive. Include `Source` in the component's `directives` array. Have your component `implement` `Sourcable` if you want type checking.

```ts
import {Source, Sourcable, Response} from 'ng2-src-directive/src';

@Component({
  selector: 'my-component'
  directives: [Source],
  ...
})
export class MyComponent implements Sourcable {
  
}
```

Add the src attribute inside your template.

```ts
...
template: [`
  <p src="my/remote/source.html"></p>
`]

```

Implement any `Sourcable` method on your component.

```ts
export class MyComponent implements Sourcable {
  
  constructor(private _el: ElementRef) { }

  sourceChanged(url: string) {
    console.log('Source changed to ' + url);
  }

  sourceChanged(url: string) {
    console.log('Source loading from ' + url);
  }

  sourceError(error: string) {
    console.log(error);
  }

  sourceReceived(res: Response) {
    this._el.nativeElement.innerHtml = res.text();
  }

}
```