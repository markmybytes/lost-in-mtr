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
    <img src="https://github.com/markmybytes/lost-in-mtr/blob/main/static/favicon.svg" alt="迷失港鐵標誌" width="80" height="80">
  </a>

  <h3 align="center">迷失港鐵</h3>

  <p align="center">
    港鐵列車車廂位置搜尋工具
    <br />
    <a href="https://github.com/markmybytes/lost-in-mtr/issues/new?labels=bug&template=bug-report---.md">報告問題</a>
    ·
    <a href="https://github.com/markmybytes/lost-in-mtr/issues/new?labels=enhancement&template=feature-request---.md">功能建議</a>
  </p>
</div>

<!-- ABOUT THE PROJECT -->

## 簡介

<p align="center">
  <img src="https://github.com/user-attachments/assets/1a65f3f7-3a34-4147-98c4-97dd527849fc" alt="迷失港鐵截圖">
</p>

[迷失港鐵](https://markmybytes.github.io/lost-in-mtr/) 是一個車廂位置搜尋工具。只需輸入**車廂編號**與**車門編號**（及前後左右側別），系統便會為你精準定位，並清晰指引所在的車卡位置。

為了方便在即時對照，工具設**車廂佈局圖**與**月台幕門貼紙**兩種顯示模式，並支援**左右翻轉**等視覺切換功能。找到位置後，你可以隨時將定位**複製並分享**至常用通訊軟件，與朋友約定集合地點時從此不需再走冤枉路。

> ⚠️ **注意：** 本工具所利用的列車編組資料並非來自港鐵官方，因此有可能出現偏差或未能涵蓋新投入服務的列車資訊。

<p align="right">(<a href="#readme-top">回到最頂</a>)</p>

### 建基於以下工具

[<img src="https://img.shields.io/badge/Bootstrap%20Icons-7952b3?logo=bootstrap&logoColor=fff&style=for-the-badge">](https://icons.getbootstrap.com/)
[<img src="https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=fff&style=for-the-badge">](https://kit.svelte.dev/)
[<img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff&style=for-the-badge">](https://tailwindcss.com/)

<p align="right">(<a href="#readme-top">回到最頂</a>)</p>

<!-- USAGE EXAMPLES -->

## 使用指南

### 搜尋

在主頁的搜尋器內輸入目標的車廂編號。由於同一個車廂編號可能被分配至多個車卡，可能會出現多個搜尋結果。

<img width="365" height="492" alt="搜尋結果" src="https://github.com/user-attachments/assets/37f3eb5c-69ae-4c34-9a33-1bacc30e0ed4" />

### 搜尋結果

搜尋結果提供兩種顯示模式，方便不同使用場景：

| 車廂佈局                                                                                                      | 幕門貼紙                                                                                                         |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/905b735f-cc96-44a7-bdb8-878ef422d809" alt="佈局模式"> | <img src="https://github.com/user-attachments/assets/18fd5b37-4b6a-4917-bcd9-7a93812af27b" alt="貼紙模式"> |

**佈局模式** 展示列車車廂的空間佈置，清楚標示各車廂相對位置。

**幕門貼紙模式** 仿照港鐵車廂上的幕門資訊貼紙，提供視覺上一致的參考。

<p align="right">(<a href="#readme-top">回到最頂</a>)</p>

<!-- GETTING STARTED -->

## 開發指南

### 所需軟件

- Volta

### 安裝 Dependency

```sh
npm install
```

### 常用指令

**本地開發**

```sh
npm run dev
```

**翻譯**

```sh
npm run machine-translate
```

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
