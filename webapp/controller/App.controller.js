sap.ui.define([
	"sap/m/MessageToast",
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/base/Log",
	"sap/ui/demo/todo/model/formatter",
	"sap/m/MessageBox",
	"sap/m/BusyDialog",
	"sap/m/TileContent",
	"sap/m/FeedContent"
], function (MessageToast,
	Controller,
	Device,
	Log,
	formatter,
	MessageBox,
	BusyDialog,
	TileContent,
	FeedContent) {
	"use strict";

	return Controller.extend("sap.ui.demo.todo.controller.App.controllers	", {
		formatter: formatter,
		onInit: function () {
			this.initialLoad = true;
			this.getSplitAppObj().setHomeIcon({
				'phone': 'phone-icon.png',
				'tablet': 'tablet-icon.png',
				'icon': 'desktop.ico'
			});
			var oStateModel = new sap.ui.model.json.JSONModel("https://cdn-api.co-vin.in/api/v2/admin/location/states");
			this.getView().byId("state").setModel(oStateModel);
			this.getView().byId("state1").setModel(oStateModel);
			var oDeviceModel = new sap.ui.model.json.JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone,
				listMode: (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
				listItemType: (sap.ui.Device.system.phone) ? "Active" : "Inactive"
			});
			this.getView().setModel(oDeviceModel, "device");
			Device.orientation.attachHandler(this.onOrientationChange, this);
			function getDate(n) {
				var date = new Date();
				var today = new Date(date);
				today.setDate(today.getDate() + n);
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				var today = dd + '-' + mm + '-' + yyyy;

				return today;
			}
			var oDate = {
				dates: {
					today: getDate(0),
					today_1: getDate(1),
					today_2: getDate(2),
					today_3: getDate(3),
					today_4: getDate(4),
					today_5: getDate(5),
					today_6: getDate(6)
				}
			};
			var oDateModel = new sap.ui.model.json.JSONModel(oDate);
			oDateModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
			this.getView().setModel(oDateModel, 'dates');

			var oModel1 = new sap.ui.model.json.JSONModel();
			var oSettingsModel = new sap.ui.model.json.JSONModel({ navigatedItem: "" });
			this.getView().setModel(oModel1);
			this.getView().setModel(oSettingsModel, 'settings');
			//      1.Get the id of the VizFrame
			var oVizFrame = this.getView().byId("idpiechart");

			if (sap.ui.Device.system.phone) {
				oVizFrame.setHeight("400px");
				oVizFrame.setWidth("400px");
			}

			//      2.Create a JSON Model and set the data
			var oModel = new sap.ui.model.json.JSONModel();
			var data = {
				'Vaccine': [{
					"Vaccination": "Dose 1",
					"Count": "783523934"
				}, {
					"Vaccination": "Dose 2",
					"Count": "436476064"
				}, {
					"Vaccination": "Not Vaccinated",
					"Count": "179013224"
				}]
			};
			oModel.setData(data);
			//  3. Create Viz dataset to feed to the data to the graph
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Vaccination',
					value: "{Vaccination}"
				}],

				measures: [{
					name: 'Count',
					value: '{Count}'
				}],

				data: {
					path: "/Vaccine"
				}
			});

			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(oModel);

			//      4.Set Viz properties with dynamic
			oVizFrame.setVizProperties({
				title: {
					text: "Vaccination Chart India"
				},
				plotArea: {
					colorPalette: d3.scale.category20().range(),
					drawingEffect: "normal"
				}
			});

			var feedSize = new sap.viz.ui5.controls.common.feeds.FeedItem({
				'uid': "size",
				'type': "Measure",
				'values': ["Count"]
			}),
				feedColor = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "color",
					'type': "Dimension",
					'values': ["Vaccination"]
				});
			oVizFrame.addFeed(feedSize);
			oVizFrame.addFeed(feedColor);
			var oGeoMap = this.getView().byId("geoMap");
			var oMapConfig = {
				"MapProvider":
					[
						{
							"name": "OSM",
							"type": "",
							"description": "",
							"tileX": "256",
							"tileY": "256",
							"maxLOD": "20",
							"copyright": "Tiles Courtesy of OpenMapTiles",
							"Source": [{
								"id": "s1",
								"url": "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
							}]
						}],
				"MapLayerStacks":
					[
						{
							"name": "Default",
							"MapLayer": [
								{
									"name": "OSM",
									"refMapProvider": "OSM"
								}]
						}]
			};
			oGeoMap.setInitialZoom('6');
			oGeoMap.setMapConfiguration(oMapConfig);
		},

		onExit: function () {
			Device.orientation.detachHandler(this.onOrientationChange, this);
		},

		onOrientationChange: function (mParams) {
			var sMsg = "Orientation now is: " + (mParams.landscape ? "Landscape" : "Portrait");
			MessageToast.show(sMsg, { duration: 5000 });
		},

		onPressNavToDetail: function () {
			this.getSplitAppObj().to(this.createId("detailDetail"));
		},

		onPressDetailBack: function () {
			this.getSplitAppObj().backDetail();
		},

		onPressMasterBack: function () {
			this.getSplitAppObj().backMaster();
		},

		onPressGoToMaster: function () {
			this.getSplitAppObj().toMaster(this.createId("master2"));
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();

			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},

		onPressModeBtn: function (oEvent) {
			var sSplitAppMode = oEvent.getSource().getSelectedButton().getCustomData()[0].getValue();

			this.getSplitAppObj().setMode(sSplitAppMode);
			MessageToast.show("Split Container mode is changed to: " + sSplitAppMode, { duration: 5000 });
		},

		getSplitAppObj: function () {
			var result = this.byId("SplitAppDemo");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oBindingContext = oItem.getBindingContext();
			var oModel = this.getView().getModel();
			var oSettingsModel = this.getView().getModel('settings');
			oSettingsModel.setProperty("/navigatedItem", oModel.getProperty("ProductId", oBindingContext));
		},

		isNavigated: function (sNavigatedItemId, sItemId) {
			return sNavigatedItemId === sItemId;
		},
		onBtnPress: function (oEvent) {
			var pincode = this.getView().byId("pincode").getValue();
			if (pincode !== '') {
				var that = this;
				function getDate(n) {
					var sDate = that.getView().byId("Date1").getDateValue();
					var today = new Date(sDate);
					today.setDate(today.getDate() + n);
					var dd = today.getDate();
					var mm = today.getMonth() + 1;
					var yyyy = today.getFullYear();
					if (dd < 10) {
						dd = '0' + dd;
					}
					if (mm < 10) {
						mm = '0' + mm;
					}
					var today = dd + '-' + mm + '-' + yyyy;

					return today;
				}

				var table = this.getView().byId("tableId");
				var table1 = this.getView().byId("tableId1");
				var table2 = this.getView().byId("tableId2");
				var table3 = this.getView().byId("tableId3");
				var table4 = this.getView().byId("tableId4");
				var table5 = this.getView().byId("tableId5");
				var table6 = this.getView().byId("tableId6");
				var vBox = this.getView().byId("Vbox1");
				var checboxes = this.getView().byId("checboxpanel");

				var dateModel = this.getView().getModel("dates");
				dateModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
				var dateData = {};
				dateData = {
					dates: {
						today: getDate(0),
						today_1: getDate(1),
						today_2: getDate(2),
						today_3: getDate(3),
						today_4: getDate(4),
						today_5: getDate(5),
						today_6: getDate(6)
					}
				};

				dateModel.setData(dateData);
				this.getView().setModel(dateModel, "dates");
				vBox.setVisible(true);
				checboxes.setVisible(true);
				var modeArray = [];
				for (var i = 0; i < 7; i++) {

					var sPath = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=" + pincode + "&date=" + getDate(i);
					var oPinModel = new sap.ui.model.json.JSONModel(sPath);
					modeArray.push(oPinModel);
					sPath = "";
					oPinModel = undefined;
				}
				table.setModel(modeArray[0]);
				table1.setModel(modeArray[1]);
				table2.setModel(modeArray[2]);
				table3.setModel(modeArray[3]);
				table4.setModel(modeArray[4]);
				table5.setModel(modeArray[5]);
				table6.setModel(modeArray[6]);
			} else {
				sap.m.MessageBox.error("Please enter a Pincode");
			}
		},

		onSwitchChange: function (sValue) {
			if (this.getView().byId("switch1").getState()) {
				sap.ui.getCore().applyTheme("sap_fiori_3_dark");
			} else {
				sap.ui.getCore().applyTheme("sap_fiori_3");
			}
		},

		onCheckbox: function (oEvent) {
			var filtermodel = new sap.ui.model.json.JSONModel();
			var filterArray = [];
			var oData1 = { filter: filterArray };
			var oFilter;
			var oBinding = this.getView().byId("tableId").getBinding("items");
			var oBinding1 = this.getView().byId("tableId1").getBinding("items");
			var oBinding2 = this.getView().byId("tableId2").getBinding("items");
			var oBinding3 = this.getView().byId("tableId3").getBinding("items");
			var oBinding4 = this.getView().byId("tableId4").getBinding("items");
			var oBinding5 = this.getView().byId("tableId5").getBinding("items");
			var oBinding6 = this.getView().byId("tableId6").getBinding("items");
			oBinding.filter([]);
			oBinding1.filter([]);
			oBinding2.filter([]);
			oBinding3.filter([]);
			oBinding4.filter([]);
			oBinding5.filter([]);
			oBinding6.filter([]);
			if (this.getView().byId("check18").getSelected()) {
				oFilter = new sap.ui.model.Filter("min_age_limit", "EQ", "18");
				filterArray.push(oFilter);
			}

			if (this.getView().byId("check45").getSelected()) {
				oFilter = new sap.ui.model.Filter("min_age_limit", "EQ", "45");
				filterArray.push(oFilter);
			}


			if (this.getView().byId("checkcovaxin").getSelected()) {
				oFilter = new sap.ui.model.Filter("vaccine", "EQ", "COVAXIN");
				filterArray.push(oFilter);
			}

			if (this.getView().byId("checkcovishield").getSelected()) {
				oFilter = new sap.ui.model.Filter("vaccine", "EQ", "COVISHIELD");
				filterArray.push(oFilter);
			}

			if (this.getView().byId("checksputnik").getSelected()) {
				oFilter = new sap.ui.model.Filter("vaccine", "EQ", "SPUTNIK V");
				filterArray.push(oFilter);
			}
			if (this.getView().byId("checkfree").getSelected()) {
				oFilter = new sap.ui.model.Filter("fee_type", "EQ", "Free");
				filterArray.push(oFilter);
			}

			if (this.getView().byId("checkpaid").getSelected()) {
				oFilter = new sap.ui.model.Filter("fee_type", "EQ", "Paid");
				filterArray.push(oFilter);
			}
			if (this.getView().byId("checkdose1").getSelected()) {
				oFilter = new sap.ui.model.Filter("available_capacity_dose1", "NE", "0");
				filterArray.push(oFilter);
			}
			if (this.getView().byId("checkdose2").getSelected()) {
				oFilter = new sap.ui.model.Filter("available_capacity_dose2", "NE", "0");
				filterArray.push(oFilter);
			}
			oBinding.filter(filterArray);
			oBinding1.filter(filterArray);
			oBinding2.filter(filterArray);
			oBinding3.filter(filterArray);
			oBinding4.filter(filterArray);
			oBinding5.filter(filterArray);
			oBinding6.filter(filterArray);
		},
		handleChange: function (oEvent) {
			var oValidatedComboBox = oEvent.getSource();
			var oSelectedKey = oValidatedComboBox.getSelectedKey();
			var oDistrictModel = new sap.ui.model.json.JSONModel("https://cdn-api.co-vin.in/api/v2/admin/location/districts/" + oSelectedKey);
			this.getView().byId("centers").destroyItems();
			this.getView().byId("centers").setSelectedKey("");
			this.getView().byId("district").setModel(oDistrictModel);
			this.getView().byId("district1").setModel(oDistrictModel);
		},
		handleChange1: function (oEvent) {
			var that = this;
			function getDate(n) {
				var sDate = that.getView().byId("Date2").getDateValue();
				var today = new Date(sDate);
				today.setDate(today.getDate() + n);
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				var today = dd + '-' + mm + '-' + yyyy;

				return today;
			}
			var oValidatedComboBox = oEvent.getSource();
			var oSelectedKey = oValidatedComboBox.getSelectedKey();
			var sPath = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=" + oSelectedKey + "&date=" + getDate(0);
			var oCenterModel = new sap.ui.model.json.JSONModel(sPath);
			this.getView().byId("centers").setModel(oCenterModel);
		},
		onBtnPress1: function (oEvent) {
			var that = this;
			var oDistrict = this.getView().byId("district").getSelectedKey();
			if (oDistrict !== '') {
				function getDate(n) {
					var sDate = that.getView().byId("Date2").getDateValue();
					var today = new Date(sDate);
					today.setDate(today.getDate() + n);
					var dd = today.getDate();
					var mm = today.getMonth() + 1;
					var yyyy = today.getFullYear();
					if (dd < 10) {
						dd = '0' + dd;
					}
					if (mm < 10) {
						mm = '0' + mm;
					}
					var today = dd + '-' + mm + '-' + yyyy;

					return today;
				}
				var table = this.getView().byId("table1Id");
				var table1 = this.getView().byId("table1Id1");
				var table2 = this.getView().byId("table1Id2");
				var table3 = this.getView().byId("table1Id3");
				var table4 = this.getView().byId("table1Id4");
				var table5 = this.getView().byId("table1Id5");
				var table6 = this.getView().byId("table1Id6");
				var vBox = this.getView().byId("Vbox2");
				var checboxes = this.getView().byId("checboxpanel1");

				var dateModel = this.getView().getModel("dates");
				dateModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
				var dateData = {};
				dateData = {
					dates: {
						today: getDate(0),
						today_1: getDate(1),
						today_2: getDate(2),
						today_3: getDate(3),
						today_4: getDate(4),
						today_5: getDate(5),
						today_6: getDate(6)
					}
				};

				dateModel.setData(dateData);
				this.getView().setModel(dateModel, "dates");
				vBox.setVisible(true);
				checboxes.setVisible(true);
				var modeArray = [];
				for (var i = 0; i < 7; i++) {

					var sPath = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=" + oDistrict + "&date=" + getDate(i);
					var oPinModel = new sap.ui.model.json.JSONModel(sPath);
					modeArray.push(oPinModel);
					sPath = "";
					oPinModel = undefined;
				}
				table.setModel(modeArray[0]);
				table1.setModel(modeArray[1]);
				table2.setModel(modeArray[2]);
				table3.setModel(modeArray[3]);
				table4.setModel(modeArray[4]);
				table5.setModel(modeArray[5]);
				table6.setModel(modeArray[6]);
			} else {
				sap.m.MessageBox.error("Please choose a District from the Menu");
			}
		},
		onBtnPress2: function (oEvent) {
			var oCenter = this.getView().byId("centers").getSelectedKey();
			if (oCenter !== '') {
				var sDate = this.getView().byId("Date3").getDateValue();
				var today = new Date(sDate);
				today.setDate(today.getDate());
				var dd = today.getDate();
				var mm = today.getMonth() + 1;
				var yyyy = today.getFullYear();
				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				today = dd + '-' + mm + '-' + yyyy;


				var table = this.getView().byId("table2Id");
				var vBox = this.getView().byId("Vbox3");
				var dateModel = this.getView().getModel("dates");
				dateModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
				vBox.setVisible(true);
				var sPath = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id=" + oCenter + "&date=" + today;
				var oCenterModel = new sap.ui.model.json.JSONModel(sPath);
				table.setModel(oCenterModel);
				this.getView().setModel(oCenterModel, "center");
			} else {

				sap.m.MessageBox.error("Please Select a Center from the Menu");
			}
		},
		onCheckbox1: function (oEvent) {
			var filtermodel = new sap.ui.model.json.JSONModel();
			var filterArray = [];
			var oData1 = { filter: filterArray };
			var oFilter;
			var oBinding = this.getView().byId("table1Id").getBinding("items");
			var oBinding1 = this.getView().byId("table1Id1").getBinding("items");
			var oBinding2 = this.getView().byId("table1Id2").getBinding("items");
			var oBinding3 = this.getView().byId("table1Id3").getBinding("items");
			var oBinding4 = this.getView().byId("table1Id4").getBinding("items");
			var oBinding5 = this.getView().byId("table1Id5").getBinding("items");
			var oBinding6 = this.getView().byId("table1Id6").getBinding("items");
			oBinding.filter([]);
			oBinding1.filter([]);
			oBinding2.filter([]);
			oBinding3.filter([]);
			oBinding4.filter([]);
			oBinding5.filter([]);
			oBinding6.filter([]);
			if (this.getView().byId("check118").getSelected()) {
				oFilter = new sap.ui.model.Filter("min_age_limit", "EQ", "18");
				filterArray.push(oFilter);
			}

			if (this.getView().byId("check145").getSelected()) {
				oFilter = new sap.ui.model.Filter("min_age_limit", "EQ", "45");
				filterArray.push(oFilter);
			}


			if (this.getView().byId("check1covaxin").getSelected()) {
				oFilter = new sap.ui.model.Filter("vaccine", "EQ", "COVAXIN");
				filterArray.push(oFilter);
			}

			if (this.getView().byId("check1covishield").getSelected()) {
				oFilter = new sap.ui.model.Filter("vaccine", "EQ", "COVISHIELD");
				filterArray.push(oFilter);
			}

			if (this.getView().byId("check1sputnik").getSelected()) {
				oFilter = new sap.ui.model.Filter("vaccine", "EQ", "SPUTNIK V");
				filterArray.push(oFilter);
			}
			if (this.getView().byId("check1free").getSelected()) {
				oFilter = new sap.ui.model.Filter("fee_type", "EQ", "Free");
				filterArray.push(oFilter);
			}

			if (this.getView().byId("check1paid").getSelected()) {
				oFilter = new sap.ui.model.Filter("fee_type", "EQ", "Paid");
				filterArray.push(oFilter);
			}
			if (this.getView().byId("check1dose1").getSelected()) {
				oFilter = new sap.ui.model.Filter("available_capacity_dose1", "NE", "0");
				filterArray.push(oFilter);
			}
			if (this.getView().byId("check1dose2").getSelected()) {
				oFilter = new sap.ui.model.Filter("available_capacity_dose2", "NE", "0");
				filterArray.push(oFilter);
			}
			oBinding.filter(filterArray);
			oBinding1.filter(filterArray);
			oBinding2.filter(filterArray);
			oBinding3.filter(filterArray);
			oBinding4.filter(filterArray);
			oBinding5.filter(filterArray);
			oBinding6.filter(filterArray);
		},
		loadMap: function (oEvent) {
			if (this.initialLoad == true) {
			var oBusyDialog = new sap.m.BusyDialog({
				title:"Loading Map for the first time",
				text:"Now loading the Vaccination centers for your location"
			});
		}
			oBusyDialog.open();
			var that = this;
			var location;
			console.log(location);
			//if (location == 'null' || location == null) {
			getLocation();
			function getLocation() {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(showPosition, error);
				} else {
					location = "Geolocation is not supported by this browser.";
				}
			}

			function showPosition(position) {
				console.log("test");
				location = position.coords.longitude +
					";" + position.coords.latitude + ";0.0";
				//localStorage.setItem('location', location);
				console.log(location);
				loadGeoMap(location, that);
			}
			function error(err) {
				console.warn(`ERROR(${err.code}): ${err.message}`);
			}
			//}
			// else {
			// 	loadGeoMap(location, that);
			// }
			function loadGeoMap(location, that) {

				var oGeoMap = that.getView().byId("geoMap");
				var oMapConfig = {
					"MapProvider":
						[
							{
								"name": "OSM",
								"type": "",
								"description": "",
								"tileX": "256",
								"tileY": "256",
								"maxLOD": "20",
								"copyright": "Tiles Courtesy of OpenMapTiles",
								"Source": [{
									"id": "s1",
									"url": "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
								}]
							}],
					"MapLayerStacks":
						[
							{
								"name": "Default",
								"MapLayer": [
									{
										"name": "OSM",
										"refMapProvider": "OSM"
									}]
							}]
				};
				const splitArray = location.split(";");
				var lat = splitArray[1];
				var long = splitArray[0];
				console.log("here" + location);
				oGeoMap.destroyVos();

				var oVaccineCenters = new sap.ui.model.json.JSONModel("https://cdn-api.co-vin.in/api/v2/appointment/centers/public/findByLatLong?lat=" + lat + "&long=" + long);
				that.getView().setModel(oVaccineCenters, "myloc");
				var i = 0;
				var oSpotTemplate = new sap.ui.vbm.Spot({
					position: {
						path: "myloc>/centers",
						formatter: function (centers) {
							console.log(centers);
							var oreturn = centers[i].long + ";" + centers[i].lat + ";0.0";
							i = i + 1;
							console.log(oreturn);
							return oreturn;
						}
					},
					type: sap.ui.vbm.SemanticType.Success,
					icon: "sap-icon://syringe",
					selectColor: 'RHLSA(0;1.0;5;1.0)', // Relative selection color - multiplication factors
					click: onClick,
					tooltip:"Vaccination Center"

				});
				var oSpotTemplate1 = new sap.ui.vbm.Spot({
					position: location,
					type: sap.ui.vbm.SemanticType.Error,
					icon: "sap-icon://employee",
					selectColor: 'RHLSA(0;1.0;5;1.0)', // Relative selection color - multiplication factors
					tooltip:"My Location"

				});
				that.globalLocation = location;
				// When a user clicks on a spot, center the map and display a detail window
				var oMenu = new sap.ui.vbm.Containers(); 
				oGeoMap.addVo(oMenu);
				function onClick(oEvent) {
					oMenu.removeAllItems();
					var today = new Date();
					today.setDate(today.getDate());
					var dd = today.getDate();
					var mm = today.getMonth() + 1;
					var yyyy = today.getFullYear();
					if (dd < 10) {
						dd = '0' + dd;
					}
					if (mm < 10) {
						mm = '0' + mm;
					}
					today = dd + '-' + mm + '-' + yyyy;

					var clickedSpot = oEvent.getSource();
					var coord = clickedSpot.getPosition();
					var pos = coord.split(";");
					oGeoMap.zoomToGeoPosition(pos[0], pos[1], oGeoMap.getZoomlevel());
					var oData = oVaccineCenters.getData();
					var index = getIndex(pos[0], pos[1], oData.centers) ? getIndex(pos[0], pos[1], oData.centers) : 0;
					var sPath = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id=" + oData.centers[index].center_id + "&date=" + today;
					var oCenterModel = new sap.ui.model.json.JSONModel(sPath);
					that.getView().setModel(oCenterModel, "center");
					var oTile = new sap.m.GenericTile({
						header: oData.centers[index].name,
						frameType:sap.m.FrameType.TwoByone
					}).addStyleClass("tileLayout");
					console.log(oCenterModel.getData());
					var oTileContent = new sap.m.TileContent();
					var oFeedContent = new sap.m.FeedContent({
							contentText:"{center>/centers/address}",
							subheader:"{center>/centers/from}",
							value:"{center>/centers/fee_type}",
					});
					oTileContent.setContent(oFeedContent);
					oTile.addTileContent(oTileContent);
					var oMenuContainer = new sap.ui.vbm.Container();
					oMenuContainer.setPosition(coord);
					oMenuContainer.setItem(oTile);
					oMenu.addItem(oMenuContainer);
					
				};
				function getIndex(long, lat, centers) {
					for (var i = 0; i < centers.length; i++) {
						if (centers[i].lat == lat && centers[i].long == long) {
							return i;
							break;
						}
					}
				};
				// Create Spot collection and bind to GeoMap
				var oSpotsCollection = new sap.ui.vbm.Spots({
					items: {
						path: "myloc>/centers",
						template: oSpotTemplate
					}
				});
				var oSpotsCollection1 = new sap.ui.vbm.Spots({
				});

				oSpotsCollection1.addItem(oSpotTemplate1)

				oGeoMap.setMapConfiguration(oMapConfig);
				oGeoMap.addVo(oSpotsCollection);
				oGeoMap.addVo(oSpotsCollection1);
				oGeoMap.setInitialZoom(14);
				oGeoMap.setInitialPosition(location);
				oGeoMap.getModel().updateBindings();
			}
			if (this.initialLoad == true){
			setTimeout(function () {
				oBusyDialog.close();
			}, 3000);
		}
		this.initialLoad = false;
			
		
		},
		onMapClick: function (details) {
			console.log(this.globalLocation);
			var that = this;
			var oGeoMap = this.getView().byId("geoMap");
			oGeoMap.destroyVos();
			console.log("clicked");
			var pos = details.getParameters().pos;
			console.log("pos" + pos);
			const splitArray = pos.split(";");
			var lat = splitArray[1];
			var long = splitArray[0];
			var oVaccineCenters = new sap.ui.model.json.JSONModel("https://cdn-api.co-vin.in/api/v2/appointment/centers/public/findByLatLong?lat=" + lat + "&long=" + long);
			this.getView().setModel(oVaccineCenters, "vaccinecenters");
			console.log(oVaccineCenters);
			//Create template spot
			var i = 0;
			var oSpotTemplate = new sap.ui.vbm.Spot({
				position: {
					path: "vaccinecenters>/centers",
					formatter: function (centers) {
						console.log(centers);
						var oreturn = centers[i].long + ";" + centers[i].lat + ";0.0";
						i = i + 1;
						console.log(oreturn);
						return oreturn;
					}
				},
				type: sap.ui.vbm.SemanticType.Success,
				icon: "sap-icon://syringe",
				selectColor: 'RHLSA(0;1.0;5;1.0)', // Relative selection color - multiplication factors
				click: onClick,
				tooltip:"Vaccination Center"

			});
			var oSpotTemplate1 = new sap.ui.vbm.Spot({
				position: this.globalLocation,
				type: sap.ui.vbm.SemanticType.Error,
				icon: "sap-icon://employee",
				selectColor: 'RHLSA(0;1.0;5;1.0)', // Relative selection color - multiplication factors
				tooltip:"My Location"

			});
			var oSpotTemplate2 = new sap.ui.vbm.Spot({
				position: pos,
				type: sap.ui.vbm.SemanticType.Default,
				icon: "sap-icon://cursor-arrow",
				selectColor: 'RHLSA(0;1.0;5;1.0)', // Relative selection color - multiplication factors
				tooltip:"Selected Location"

			});
				// When a user clicks on a spot, center the map and display a detail window
				var oMenu = new sap.ui.vbm.Containers({
					maxSel: "4"
				}); 
				oGeoMap.addVo(oMenu);
				function onClick(oEvent) {
					oMenu.removeAllItems();
					var today = new Date();
					today.setDate(today.getDate());
					var dd = today.getDate();
					var mm = today.getMonth() + 1;
					var yyyy = today.getFullYear();
					if (dd < 10) {
						dd = '0' + dd;
					}
					if (mm < 10) {
						mm = '0' + mm;
					}
					today = dd + '-' + mm + '-' + yyyy;

					var clickedSpot = oEvent.getSource();
					var coord = clickedSpot.getPosition();
					var pos = coord.split(";");
					oGeoMap.zoomToGeoPosition(pos[0], pos[1], oGeoMap.getZoomlevel());
					var oData = oVaccineCenters.getData();
					var index = getIndex(pos[0], pos[1], oData.centers) ? getIndex(pos[0], pos[1], oData.centers) : 0;
					var sPath = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByCenter?center_id=" + oData.centers[index].center_id + "&date=" + today;
					var oCenterModel = new sap.ui.model.json.JSONModel(sPath);
					that.getView().setModel(oCenterModel, "center");
					var oTile = new sap.m.GenericTile({
						header: oData.centers[index].name,
						frameType:sap.m.FrameType.TwoByone
					}).addStyleClass("tileLayout");
					console.log(oCenterModel.getData());
					var oTileContent = new sap.m.TileContent();
					var oFeedContent = new sap.m.FeedContent({
							contentText:"{center>/centers/address}",
							subheader:"{center>/centers/from}",
							value:"{center>/centers/fee_type}",
					});
					oTileContent.setContent(oFeedContent);
					oTile.addTileContent(oTileContent);
					var oMenuContainer = new sap.ui.vbm.Container();
					oMenuContainer.setPosition(coord);
					oMenuContainer.setItem(oTile);
					oMenu.addItem(oMenuContainer);
					
				};
			function getIndex(long, lat, centers) {
				for (var i = 0; i < centers.length; i++) {
					if (centers[i].lat == lat && centers[i].long == long) {
						return i;
						break;
					}
				}
			};
			console.log(oSpotTemplate);
			// Create Spot collection and bind to GeoMap
			var oSpotsCollection = new sap.ui.vbm.Spots({
				items: {
					path: "vaccinecenters>/centers",
					template: oSpotTemplate
				}
			});
			var oSpotsCollection1 = new sap.ui.vbm.Spots({
			});
			oSpotsCollection1.addItem(oSpotTemplate1);
			oSpotsCollection1.addItem(oSpotTemplate2)
			//console.log(oSpotsCollection);
			oGeoMap.addVo(oSpotsCollection);
			oGeoMap.addVo(oSpotsCollection1);
		}

	});
});
