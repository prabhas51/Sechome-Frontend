import { Component, Injectable, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

@Injectable()
export class AppComponent {
  title = 'Sechome';

  @ViewChild("displayUserProvidedPhoto") displayUserProvidedPhoto: any;
  video: any;
  canvas: any;
  stream: any;

  digilockerUrl: any;
  requestId: any;
  userDetails: any = new Map();
  redirect: RequestRedirect = "follow";
  mode: RequestMode = "cors"
  userProvidedPhotoSRC: any;
  // userProvidedPhotoSRC: any = "https://sap-my.sharepoint.com/personal/anshul_kumar04_sap_com/Documents/aadhaar_Photo.jpeg";

  ngOnInit() {
    this.video = document.querySelector("#video");
    this.canvas = document.querySelector("#canvas");
  }

  async startCamera() {
    this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    this.video.srcObject = this.stream;
    console.log("Camera Triggered");
  }
  clickPhoto() {
    if (this.canvas) {
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    }
    let image_data_url = this.canvas.toDataURL('image/jpeg');
    this.userProvidedPhotoSRC = image_data_url;
  }

  stopCamera() {
    this.stream.getTracks().forEach(function (track: any) {
      track.stop();
    });
  }


  openURL() {
    this.openDigilockerURL();
    window.addEventListener('focus', this.triggerAadhaarDetailFetchAPI, false);
  }

  triggerAadhaarDetailFetchAPI = () => {
    this.getdata();
    window.removeEventListener('focus', this.triggerAadhaarDetailFetchAPI);
    //Get Eaadhar Response
    this.userDetails.set("Name", this.getEadhaarDetailsResponse.result.name);
    this.userDetails.set("Date Of Birth", this.getEadhaarDetailsResponse.result.dob);
    this.userDetails.set("gender", this.getEadhaarDetailsResponse.result.gender);
    this.userDetails.set("uid", this.getEadhaarDetailsResponse.result.uid);
    this.userDetails.set("address", this.getEadhaarDetailsResponse.result.address);
    // this.userDetails.set("photo", this.getEadhaarDetailsResponse.result.photo);
    this.userDetails.set("district", this.getEadhaarDetailsResponse.result.splitAddress.district);
    this.userDetails.set("state", this.getEadhaarDetailsResponse.result.splitAddress.state);
    this.userDetails.set("city", this.getEadhaarDetailsResponse.result.splitAddress.city);
    this.userDetails.set("pincode", this.getEadhaarDetailsResponse.result.splitAddress.pincode);
    this.userDetails.set("country", this.getEadhaarDetailsResponse.result.splitAddress.country);

    //Get Details Response
    this.userDetails.set("Pan Number", this.getDetailsReponse.result.files[1].id.substr(-10));

    // this.userDetails.set("criminalRecord", "Not Found");

    var object1 = document.getElementById("object1");
    if (object1) {
      object1.style.display = "none";
    }
    var button = document.getElementById("button");
    if (button) {
      button.style.display = "none";
    }
    var object2 = document.getElementById("object2");
    if (object2) {
      object2.style.display = "block";
    }
    setTimeout(() => {
      var object2 = document.getElementById("object2");
      if (object2) {
        object2.style.display = "none";
      }

      var data = document.getElementById("data");
      if (data) {
        data.style.display = "block";
      }
    }, 1);


    this.displayUserProvidedPhoto.nativeElement.src = this.userProvidedPhotoSRC;
    this.getLocation();
  }

  openDigilockerURL() {
    // Calling the Get digilockerUrl API
    // var requestOptions = {
    //   method: 'GET',
    //   redirect: this.redirect,
    //   mode: this.mode
    // };
    // fetch("/sechome/geturl", requestOptions)
    //   .then(response => response.json())
    //   .then(result => {
    //     this.digilockerUrl = result.result.url;
    //     this.requestId = result.result.requestId;
    //     window.open(this.digilockerUrl, "_blank");
    //   })
    //   .catch(error => console.log('error', error));

    // Hardcoding digilocker URL
    this.digilockerUrl = this.getUrlResponse.result.url;
    this.requestId = this.getUrlResponse.result.requestId;
    window.open(this.digilockerUrl, "_blank");
  }

  getdata() {
    var body = JSON.stringify({
      "requestId": this.requestId
    });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'POST',
      redirect: this.redirect,
      body: body,
      headers: myHeaders,
      mode: this.mode
    };
    fetch("/sechome/getdata", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  // setUserProvidedPhoto(event: any) {
  //   if (!event.target.files[0] || event.target.files[0].length == 0) {
  //     alert('You must select an image');
  //     return;
  //   }

  //   var mimeType = event.target.files[0].type;

  //   if (mimeType.match(/image\/*/) == null) {
  //     alert("Only images are supported");
  //     return;
  //   }

  //   this.userProvidedPhotoSRC = URL.createObjectURL(event.target.files[0]);
  //   console.log(this.userProvidedPhotoSRC);
  // }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  showPosition(position: any) {
    var latlongvalue = position.coords.latitude + "," + position.coords.longitude;
    var img_url = "https://maps.googleapis.com/maps/api/staticmap?center=" + latlongvalue + "&amp;zoom=14&amp;size=400x300&amp;key=AIzaSyAa8HeLH2lQMbPeOiMlM9D1VxZ7pbGQq8o";
    let map = document.getElementById("mapholder");
    // let googleMapDirectionUrl = "https://www.google.com/maps/search/?api=1&query=" + latlongvalue;
    let googleMapDirectionUrl = "https://www.google.com/maps/dir/29.868071,77.894844/29.865191,77.893944";
    if (map) {
      map.innerHTML =
        `<p><b>Current Location: ${latlongvalue} </b><button onclick="window.open('${googleMapDirectionUrl}','_blank')">Get Directions</button></p>
        <img src='${img_url}'>`;
    }
  }


  private readonly getUrlResponse = {
    "essentials": {
      "signup": false
    },
    "id": "61ad9f3625b9791f5dd1d68c",
    "patronId": "6197e6856475d597bf33a08a",
    "task": "url",
    "result": {
      "url": "https://api.digitallocker.gov.in/public/oauth2/1/authorize?client_id=7E5773C4&dl_flow&redirect_uri=https%3A%2F%2Fdigilocker-preproduction.signzy.tech%2Fdigilocker-auth-complete&response_type=code&state=61ad9f36708cae170ff6f3d8",
      "requestId": "61ad9f36708cae170ff6f3d8"
    }
  };

  private readonly getEadhaarDetailsResponse = {
    "essentials": {
      "requestId": "61ad9f36708cae170ff6f3d8"
    },
    "id": "61ada01725b9791f5dd1d6bb",
    "patronId": "6197e6856475d597bf33a08a",
    "task": "getEadhaar",
    "result": {
      "name": "ANSHUL KUMAR",
      "uid": "xxxxxxxx2433",
      "dob": "31/05/1996",
      "gender": "MALE",
      "x509Data": {
        "subjectName": "DS MINISTRY OF ELECTRONICS AND INFORMATION TECHNOLOGY 01",
        "certificate": "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",
        "details": {
          "version": 2,
          "subject": {
            "countryName": "IN",
            "organizationName": "MINISTRY OF ELECTRONICS AND INFORMATION TECHNOLOGY",
            "organizationalUnitName": "NeGD",
            "commonName": "DS MINISTRY OF ELECTRONICS AND INFORMATION TECHNOLOGY 01",
            "serialNumber": "0f30cb67333f634db11fdb41868b343a6f0469581bdb9fd2a2e4cb59e7797a43",
            "postalCode": "110003",
            "telephoneNumber": "b176790cc3a74b862e6b6b50814a8887a5f372ac5a0689eb5219c0b4a978583c",
            "stateOrProvinceName": "Delhi"
          },
          "issuer": {
            "countryName": "IN",
            "organizationName": "Capricorn Identity Services Pvt Ltd.",
            "organizationalUnitName": "Certifying Authority",
            "postalCode": "110092",
            "stateOrProvinceName": "DELHI",
            "streetAddress": "18,LAXMI NAGAR DISTRICT CENTER",
            "houseIdentifier": "G5,VIKAS DEEP BUILDING",
            "commonName": "Capricorn CA 2014"
          },
          "serial": "02A905",
          "notBefore": "2017-12-13T09:14:46.000Z",
          "notAfter": "2019-12-13T09:14:46.000Z",
          "subjectHash": "d8b970c7",
          "signatureAlgorithm": "sha256WithRSAEncryption",
          "fingerPrint": "D3:B7:FE:62:58:09:B9:97:82:B5:AA:8C:F5:46:80:FE:32:67:EA:9E",
          "publicKey": {
            "algorithm": "sha256WithRSAEncryption"
          },
          "altNames": [],
          "extensions": {
            "extendedKeyUsage": "Microsoft Smartcardlogin, E-mail Protection, TLS Web Client Authentication, 1.3.6.1.4.1.311.10.3.12",
            "authorityKeyIdentifier": "keyid:43:80:04:A0:07:B5:E0:CF",
            "authorityInformationAccess": "OCSP - URI:http://ocvs.certificate.digital/\nCA Issuers - URI:https://www.certificate.digital/repository/CapricornCA2014.cer",
            "certificatePolicies": "Policy: 2.16.356.100.2.2\n  CPS: https://www.certificate.digital/repository/cpsv1.pdf\n  User Notice:\n    Explicit Text: Class 2 Certificate issued by Capricorn Certifying Authority\nPolicy: 2.16.356.100.10.1\n  User Notice:\n    Explicit Text: Organizational Document Signer Certificate",
            "cRLDistributionPoints": "Full Name:\n  URI:https://www.certificate.digital/crl/CapricornCA.crl",
            "subjectKeyIdentifier": "42:20:58:03:49:7D:83:F9",
            "keyUsage": "Digital Signature, Non Repudiation",
            "subjectAlternativeName": "email:d.nayak@nic.in"
          }
        },
        "validAadhaarDSC": "yes"
      },
      "address": "S/O VIJAY KUMAR GOEL 72/436, AGARSAIN VIHAR JANSATH ROAD MUZAFFARNAGAR MUZAFFARNAGAR UTTAR PRADESH 251002",
      "photo": "https://persist.signzy.tech/api/files/256208965/download/532908199c354224af70bf190a35907315b26a684e454216997bda698250a3c7.jpeg",
      "splitAddress": {
        "district": [
          "MUZAFFARNAGAR"
        ],
        "state": [
          [
            "UTTAR PRADESH",
            "UP"
          ]
        ],
        "city": [
          "MUZAFFARNAGAR"
        ],
        "pincode": "251002",
        "country": [
          "IN",
          "IND",
          "INDIA"
        ],
        "addressLine": "S/O VIJAY KUMAR GOEL JANSATH ROAD"
      }
    }
  };
  private readonly getDetailsReponse = {
    "essentials": {
      "requestId": "61ad9f36708cae170ff6f3d8"
    },
    "id": "61ad9fbf25b9791f5dd1d6a8",
    "patronId": "6197e6856475d597bf33a08a",
    "task": "getDetails",
    "result": {
      "userDetails": {
        "digilockerid": "d955f2b9-fe3b-52f7-bd7f-b3bcdca9069c",
        "name": "Anshul Kumar",
        "dob": "31/05/1996",
        "gender": "M",
        "eaadhaar": "Y"
      },
      "files": [{
        "name": "Aadhaar Card",
        "type": "file",
        "size": "",
        "date": "06/12/2021",
        "parent": "",
        "mime": [
          "application/pdf",
          "application/xml"
        ],
        "doctype": "ADHAR",
        "description": "Aadhaar Card",
        "issuerid": "in.gov.uidai",
        "issuer": "Aadhaar, Unique Identification Authority of India",
        "id": "in.gov.uidai-ADHAR-33ce4ac46313364a2548e105772f1715"
      },
      {
        "name": "PAN Verification Record",
        "type": "file",
        "size": "",
        "date": "18/06/2020",
        "parent": "",
        "mime": [
          "application/json",
          "application/xml",
          "application/pdf"
        ],
        "doctype": "PANCR",
        "description": "PAN Verification Record",
        "issuerid": "in.gov.pan",
        "issuer": "Income Tax Department",
        "id": "in.gov.pan-PANCR-DOVPK3425M"
      }
      ]
    }
  };

}

