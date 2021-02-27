# Editmode Standalone

Editmode allows you to turn plain text in your website into easily inline-editable bits of content that can be managed by anyone with no technical knowledge.

## Installation
**From CDN:** Add the following script to the end of your `<head>` section.
```
<script src="https://unpkg.com/editmode-standalone@^1/dist/main.min.js"></script>
```


## Usage

*Single Content*
```HTML
<p chunk-id="some-chunk-identifier">I'm a placeholder</p>

<img chunk-id="some-img-chunk-identifier"  src="https://backup-img-src.png"/>
```

*Collection*
```HTML
<collection collection-id="some-collection-identifier" class="container-class" itemClass="classForEachItems">
  <p field-id="field-id-or-name">Placeholder for this field</p>

  <img field-id="field-id-or-name"/>
</collection>
```


### Todos
- Parse variable values
