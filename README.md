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
  <h3 align="center">迷失港鐵</h3>

  <p align="center">
    一個車廂位置定位工具
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
  <img src="https://github.com/user-attachments/assets/01e0b2dd-657f-40de-b964-50df423f5f1b" width="50%">
<p align="right">

迷失港鐵是一個車廂位置定位工具，透過車廂編號及車門編號來尋找你所在的位置。而搜尋結果亦能方便地分享至 Whatsapp 或 Telegram。

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

在主頁的搜尋器內，輸入車門側上的車廂編號及車門編號資料。<br>
<img src="https://github.com/user-attachments/assets/4cfdf627-e417-41df-9ef2-0b8305e93378" width="50%">

因為同一個車廂編號可能會被分配至多個車卡，所吻合的結果將會被顯示出來。<br>
<img src="https://github.com/user-attachments/assets/0893c65b-1940-45c5-a5c7-73d187e7d66d" width="50%">

### 切換方向

每個搜尋結果上均設有
  1. 行車方向切換按鈕（用作選擇列車的行車方向）
  2. 列車方向切換按鈕（用作調轉列車頭尾在屏幕上的顯示方向）
<img src="https://github.com/user-attachments/assets/94941419-4f1d-4639-803b-726b70ce40bf" width="50%">

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
