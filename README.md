# lost-in-mtr
<a id="readme-top"></a>



<!-- PROJECT SHIELDS -->
<div align="center">

  [![Tag][tag-shield]][tag-url]
  [![Contributors][contributors-shield]][contributors-url]
  [![Forks][forks-shield]][forks-url]
  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]
  [![License][license-shield]][license-url]
  
</div>



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/markmybytes/lost-in-mtr">
    <img src="https://github.com/user-attachments/assets/43b3154a-968a-499b-bf7a-a6ec325429b5" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">迷失港鐵</h3>

  <p align="center">
    港鐵列車車廂位置搜尋器
    <br />
    <br />
    <a href="https://github.com/markmybytes/lost-in-mtr/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/markmybytes/lost-in-mtr/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- ABOUT THE PROJECT -->
## 簡介

<p align="center">
  <img src="https://github.com/user-attachments/assets/1a65f3f7-3a34-4147-98c4-97dd527849fc" alt="project screenshot">
<p align="right">

[迷失港鐵](https://markmybytes.github.io/lost-in-mtr/)是一個車廂位置搜尋工具，透過車廂編號及車門編號來尋找你所在的車卡。搜尋結果更可以方便地分享至 Whatsapp 或 Telegram。

而迷失港鐵所利用到的列車編組資料並非來自港鐵官方，因此有可能會出錯或未能尋找新投入服務的列車資訊。

<p align="right">(<a href="#readme-top">回到最頂</a>)</p>

### 第三方工具使用
[<img src="https://img.shields.io/badge/bootstrap%20icons-7532fa?style=for-the-badge&logo=bootstrap&logoColor=white">](https://icons.getbootstrap.com/)
[<img src="https://img.shields.io/badge/svelte-ff3e00?style=for-the-badge&logo=svelte&logoColor=white">](https://svelte.dev/)
[<img src="https://img.shields.io/badge/tailwindcss-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white">](https://tailwindcss.com/)

<p align="right">(<a href="#readme-top">回到最頂</a>)</p>



<!-- GETTING STARTED -->
## 開發

### 所需軟件

- Node.js (≥ 20) https://nodejs.org/en/download/package-manager

### 安裝 Dependency

```sh
npm install
```

### 常用指令

- Debug run
  ```sh
  npm run dev
  ```

- Build the site
  ```sh
  npm run build
  ```

<p align="right">(<a href="#readme-top">回到最頂</a>)</p>



<!-- USAGE EXAMPLES -->
## 使用

### 搜尋

在主頁的搜尋器內，輸入車門側上的車廂編號。<br>
因為同一個車廂編號可能會被分配至多個車卡，所吻合的結果將會被顯示出來。

<img src="https://github.com/user-attachments/assets/4c507e6a-66bf-4c92-83b9-a15de364c5ca" alt="search result screenshot">

### 搜尋結果

搜尋結果設有兩種顯示模式

| 車廂佈局 | 幕門貼紙 |
|---|---|
| <img src="https://github.com/user-attachments/assets/905b735f-cc96-44a7-bdb8-878ef422d809" alt="Layout Mode"> | <img src="https://github.com/user-attachments/assets/18fd5b37-4b6a-4917-bcd9-7a93812af27b" alt="PSD Label Mode"> |


<p align="right">(<a href="#readme-top">回到最頂</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[tag-url]: https://github.com/markmybytes/lost-in-mtr/releases
[tag-shield]: https://img.shields.io/github/v/tag/markmybytes/lost-in-mtr?style=for-the-badge&label=LATEST&color=%23B1B1B1
[contributors-shield]: https://img.shields.io/github/contributors/markmybytes/lost-in-mtr.svg?style=for-the-badge
[contributors-url]: https://github.com/markmybytes/lost-in-mtr/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/markmybytes/lost-in-mtr.svg?style=for-the-badge
[forks-url]: https://github.com/markmybytes/lost-in-mtr/network/members
[stars-shield]: https://img.shields.io/github/stars/markmybytes/lost-in-mtr.svg?style=for-the-badge
[stars-url]: https://github.com/markmybytes/lost-in-mtr/stargazers
[issues-shield]: https://img.shields.io/github/issues/markmybytes/lost-in-mtr.svg?style=for-the-badge
[issues-url]: https://github.com/markmybytes/lost-in-mtr/issues
[license-shield]: https://img.shields.io/github/license/markmybytes/lost-in-mtr.svg?style=for-the-badge
[license-url]: https://github.com/markmybytes/lost-in-mtr/blob/master/LICENSE.txt
