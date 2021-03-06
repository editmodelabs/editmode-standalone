# Editmode Standalone

Editmode allows you to turn plain text in your website into easily inline-editable bits of content that can be managed by anyone with no technical knowledge.

## Installation
**From CDN:** Add the following script to the end of your `<head>` section.
```HTML
<script src="https://unpkg.com/editmode-standalone@^1/dist/standalone.js"></script>
```

**Set an Editmode Project ID:** Add the following script to the end of your `<head>` or `<body>` section.
```HTML
<script>
  EditmodeStandAlone.projectId = "YOUR-PROJECT-ID"
</script>
```
*Don't have a project id? Sign up for one [here](https://editmode.com/users/sign_up?private_beta=true)*


## Usage

*Single Content*
```HTML
<p chunk-id="some-chunk-identifier">I'm a placeholder</p>

<img chunk-id="some-img-chunk-identifier"  src="https://backup-img-src.png"/>
```

*Collection*
```HTML
<template collection-id="some-collection-identifier" class="container-class" itemClass="classForEachItems">
  <p field-id="field-id-or-name">Placeholder for this field</p>

  <img field-id="field-id-or-name"/>
</template>
```

*Filter Collection*

Use `tags` attribute to filter collection items by tags, use `limit` attribute to limit how many collection items will be rendered.

Seperate the tags with space for multiple tags `tags="heropost recentposts"`

```HTML
<template collection-id="some-collection-identifier" tags="recentposts" limit="3">
  <p field-id="field-id-or-name">Placeholder for this field</p>

  <img field-id="field-id-or-name"/>
</template>
```


*Variable Parsing*
```HTML
<p variables="{name: 'Jen'}" chunk-id="some-chunk-identifier">Hi, User</p>
```

*Working with Image Transformation*

Use `transform` attribute to perform real-time image transformations to deliver perfect images to the end-users.

This chunk should render an image with 200 x 200 dimension:
```HTML
<img chunk-id="some-img-chunk-identifier"  transform="w-200 h-200 c-force" />
```
Please see complete list of [transformation parameters](https://editmode.com/docs#/imagekit_properties)


### Demo
[Open in Repl.it](https://repl.it/@jengkarlong/EditmodeStandAlone-Example)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/puuripurii"><img src="https://avatars.githubusercontent.com/u/26903002?v=4?s=40" width="40px;" alt=""/><br /><sub><b>Jen Villaganas </b></sub></a><br /><a href="https://github.com/Editmodelabs/editmode-standalone/commits?author=puuripurii" title="Code">💻</a> <a href="https://github.com/Editmodelabs/editmode-standalone/commits?author=puuripurii" title="Documentation">📖</a> <a href="#infra-puuripurii" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/Editmodelabs/editmode-standalone/commits?author=puuripurii" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/jenvillaganas"><img src="https://avatars.githubusercontent.com/u/26903002?v=4?s=40" width="40px;" alt=""/><br /><sub><b>Jen Villaganas </b></sub></a><br /><a href="https://github.com/Editmodelabs/editmode-standalone/commits?author=jenvillaganas" title="Code">💻</a> <a href="https://github.com/Editmodelabs/editmode-standalone/commits?author=jenvillaganas" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!