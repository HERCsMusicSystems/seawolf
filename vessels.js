////////////
// Sonars //
////////////

var TorpedoSonar = function (vessel) {
	sonar . call (this, vessel);
};
inherit (TorpedoSonar, sonar);
TorpedoSonar . prototype . ping_sound = 'torpedo_ping';

/////////////
// Vessels //
/////////////

var Oiler = function (name, country) {
	if (country === undefined) country = 'Bahamas';
	if (name === undefined) name = 'Oil Tanker';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'Oil Tanker';
	this . speeds = [0, 1, 4, 8, 12, 15, 18];
	this . strength = 6;
};
inherit (Oiler, vessel);
Oiler . prototype . image = 'OilTanker';
Oiler . prototype . info = 'https://en.wikipedia.org/wiki/Oil_tanker';
Oiler . prototype . names = [
	'Seawise Giant', 'Pierre Guillaumat', 'Prairial', 'Batillus', 'Bellamya', 'Esso Atlantic', 'Esso Pacific',
	'TI Africa', 'TI Asia', 'TI Europe', 'TI Oceania', 'TI America', 'TI Australia', 'Berge Emperor', 'Berge Empress',
	'Oceania', 'TI Oceania', 'Hellespont Fairfax', 'Hellespont Tara', 'Hellespont Alhambra', 'Hellespont Metropolis',
	'Maersk Peary', 'MT Jutul', 'Exxon Valdez', 'Knock Nevis', 'Jahre Viking', 'Happy Giant', 'Hellas Fos', 'Sea Giant',
	'Ulsan Master', 'Kapetan Giannis', 'Esso Pacific', 'Kapetan Michalis', 'Nai Superba', 'Nai Genova',
	'Sea Saga', 'Sea Serenade', 'Sea Symphony', 'Sea Song', 'Sea Saint', 'Sea Scape', 'Sea Stratus', 'Torrey Canyon'
];

var GasTanker = function (name, country) {
	if (country === undefined) country = 'Bahamas';
	if (name === undefined) name = 'Gas Tanker';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'Gas Tanker';
	this . speeds = [0, 1, 4, 8, 12, 15, 18];
	this . strength = 5;
};
inherit (GasTanker, vessel);
GasTanker . prototype . image = 'GasTanker';
GasTanker . prototype . info = 'https://en.wikipedia.org/wiki/Gas_carrier';
GasTanker . prototype . names = [
	'Al Barrah', 'Al Dafna', 'Al Jabirah', 'Al Oraic', 'Al Rayyan', 'Al Thakhira', 'Ayame', 'Almarona', 'Almajedah', 'Alrar', 'Althea Gas',
	'Anafi', 'Annapurna', 'Antwerpen', 'Arctic Discoverer', 'Armada LNG Mediterrana', 'Asia Excellence', 'Australgas', 'Aurora Capricorn',
	'Azeri Gas', 'Al Utouriya', 'Al Thumama', 'Al Sahla', 'Berlian Ekuator', 'Berge Ningbo', 'Berge Nantong',
	'British Commerce', 'British Councillor', 'British Commerce', 'British Courage', 'British Diamond', 'British Emerald',
	'British Innovator', 'British Merchant', 'British Ruby', 'British Sapphire', 'British Trader',
	'BW Gemini', 'BW TYR', 'BW Empress', 'Yuyo Berge', 'Disha',
	'Flanders Loyalty', 'Flanders Liberty', 'Flanders Harmony', 'Fuji LNG',
	'Gaz Venezia', 'Gaz Victory', 'Gas miracle', 'Gas magic', 'Gas cat', 'Gas lıne', 'Gandria', 'Gimi',
	'Golar arctic', 'Golar celsius', 'Golar freeze', 'Golar grand', 'Golar mazo', 'Golar maria', 'Golar seal',
	'Golar spirit', 'Golar viking', 'Golar winter', 'Gas courage', 'Gas commerce',
	'Gas stella', 'Grace Cosmos', 'Grace Acacia', 'Gas Diana', 'Hellas nautilus', 'Iris Glory', 'Independence',
	'Jag vidhi', 'Jag vishnu', 'Jag Vijaya', 'Jag Viraat', 'Jag Vasanth', 'Jag Vayu', 'Kailash Gas', 'Kent', 'Lyne', 'Leto providence',
	'Maharshi Labhatreya', 'Maharshi Shubhatreya', 'Maharshi Krishnatreya', 'Maharshi Devatreya', 'Maharshi Vamadeva', 'Maharshi Bhardwaj', 'Maharshi Devatreya',
	'Maersk Venture', 'Maersk Jade', 'Mill House', 'Maersk jewel', 'Maersk Genesis', 'Maersk Galaxy', 'Maersk Gusto',
	'Maersk Global', 'Maersk Glory', 'Maersk Visual', 'Maersk Value', 'Marshal Vasilevskiy',
	'Marycam Swan', 'Mill Reef', 'Methane Princess', 'Malanje',
	'Norgas Innovation', 'Norgas Unikum', 'Norgas Bahrain Vision', 'Norgas Invention', 'Norgas Creation', 'Norgas Conception', 'Ocean orchid',
	'Pertamina Gas 1', 'Perseverance V', 'Progress', 'Prospect', 'BW Odin', 'Aurora Capricorn', 'Pacific Arcadia', 'Pampero', 'Raahi',
	'Secreto', 'Sylvie', 'Sigas Sonja', 'Sigas Silvia', 'Sir Ivor', 'Stena Blue Sky', 'Stena Clear Sky', 'Stena Crystal Sky',
	'SKARPOV', 'Sansovino', 'Seri Bijaksana', 'Soyo', 'Thetis Glory', 'Tenacity IV', 'Venus Glory', 'Yuhsan', 'Yuyo', 'Yuyo Spirits', 'Zekreet'
];

var Roro = function (name, country) {
	if (country === undefined) countr = 'Bahamas';
	if (name === undefined) name = 'RO-RO';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'Roll-on / Roll-off';
	this . speeds = [0, 1, 4, 8, 12, 15, 18];
	this . strnegth = 5;
};
inherit (Roro, vessel);
Roro . prototype . image = 'aquarius_leader';
Roro . prototype . info = 'https://en.wikipedia.org/wiki/Roll-on/roll-off';
Roro . prototype . names = [
	'Aegean Leader', 'Alioth Leader', 'Altair Leader', 'Andromeda Leader', 'Antares Leader', 'Aphrodite Leader', 'Apollon Leader', 'Aquarius Leader', 'Aries Leader', 'Artemis Leader', 'Asian Leader', 'Asteria Leader', 'Atlas Leader', 'Auriga Leader', 'Baltic Leader',
	'Canopus Leader', 'Capricornus Leader', 'Cassiopeia Leader', 'Castor Leader', 'Centaurus Leader', 'Century Leader No.1', 'Century Leader No.3', 'Century Leader No.5', 'Cepheus Leader', 'Cetus Leader', 'Columbia Leader', 'Coral Leader', 'Cronus Leader', 'Cygnus Leader',
	'Daedalus Leader', 'Delphinus Leader', 'Demeter Leader', 'Deneb Leader', 'Dione Leader', 'Dionysos Leader', 'Dorado Leader',
	'Emerald Leader', 'Equuleus Leader', 'Eridanus Leader', 'Gaia Leader', 'Galaxy Leader', 'Garnet Leader', 'Gemini Leader', 'Gentle Leader', 'Global Leader', 'Glorious Leader', 'Goliath Leader', 'Graceful Leader', 'Guardian Leader',
	'Harmony Leader', 'Harvest Leader', 'Helios Leader', 'Hercules Leader', 'Heritage Leader', 'Hermes Leader', 'Heroic Leader', 'Hestia Leader', 'Horizon Leader', 'Hudson Leader', 'Hyperion Leader',
	'Iris Leader', 'Jupiter Leader', 'Kalimantan Leader', 'Kariyushi Leader', 'Leader', 'Leo Leader', 'Libra Leader', 'Lotus Leader', 'Lyra Leader',
	'Mercury Leader', 'Metis Leader', 'Monoceros Leader', 'Neptune Leader', 'Oceanus Leader', 'Opal Leader', 'Orion Leader',
	'Pacific Leader', 'Pegasus Leader', 'Perseus Leader', 'Phoenix Leader', 'Pioneer Leader', 'Pisces Leader', 'Pleiades Leader', 'Pluto Leader', 'Polaris Leader', 'Poseidon Leader', 'Positive Leader', 'Procyon Leader', 'Prometheus Leader', 'Pyxis Leader',
	'Rhea Leader', 'Rigel Leader', 'Sagittarius Leader', 'Sara Leader', 'Selene Leader', 'Sirius Leader', 'Spica Leader', 'Sulawesi Leader', 'Sumatera Leader',
	'Taurus Leader', 'Themis Leader', 'Tigris Leader', 'Trans Leader', 'Triton Leader',
	'Vega Leader', 'Venus Leader', 'Victory Leader', 'Virgo Leader', 'Volans Leader', 'Zenith Leader', 'Zeus Leader'
];

var ContainerVessel = function (name, country) {
	if (country === undefined) countr = 'Bahamas';
	if (name === undefined) name = 'Container Vessel';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'Container Vessel';
	this . speeds = [0, 1, 4, 8, 12, 15, 18];
	this . strnegth = 5;
};
inherit (ContainerVessel, vessel);
ContainerVessel . prototype . image = 'ContainerVessel';
ContainerVessel . prototype . info = 'https://en.wikipedia.org/wiki/Container_ship';
ContainerVessel . prototype . names = [
	'MSC Gülsün', 'MSC Samar', 'MSC Leni', 'MSC Mia', 'MSC Mina', 'MSC Isabella', 'MSC Arina', 'MSC Nela', 'MSC Sixin',
	'OOCL Hong Kong', 'OOCL Germany', 'OOCL Japan', 'OOCL United Kingdom', 'OOCL Scandinavia', 'OOCL Indonesia',
	'COSCO Shipping Universe', 'COSCO Shipping Nebula', 'COSCO Shipping Galaxy', 'COSCO Shipping Solar', 'COSCO Shipping Star', 'COSCO Shipping Planet',
	'CMA CGM Antoine de Saint Exupery', 'CMA CGM Jean Mermoz', 'CMA CGM Louis Bleriot',
	'Madrid Maersk', 'Munich Maersk', 'Moscow Maersk', 'Milan Maersk', 'Monaco Maersk', 'Marseille Maersk', 'Manchester Maersk', 'Murcia Maersk', 'Manila Maersk', 'Mumbai Maersk', 'Maastricht Maersk',
	'Ever Golden', 'Ever Goods', 'Ever Genius', 'Ever Given', 'Ever Gifted', 'Ever Grade', 'Ever Gentle',
	'MOL Truth', 'MOL Treasure', 'MOL Triumph', 'MOL Trust', 'MOL Tribute', 'MOL Tradition',
	'Ever Glory', 'Ever Govern', 'Ever Globe', 'Ever Greet',
	'COSCO Shipping Taurus', 'COSCO Shipping Gemini', 'COSCO Shipping Virgo', 'COSCO Shipping Libra', 'COSCO Shipping Sagittarius', 'Barzan',
	'Al Muraykh', 'Al Nefud', 'Al Zubara', 'Al Dahna', 'Tihama', 'MSC Diana', 'MSC Ingy', 'MSC Eloane', 'MSC Mirjam', 'MSC Rifaya', 'MSC Leanne', 'MSC Reef', 'MSC Jade', 'MSC Ditte', 'MSC Mirja', 'MSC Erica', 'MSC Tina', 'MSC Anna', 'MSC Viviana',
	'COSCO Shipping Aries', 'COSCO Shipping Leo', 'COSCO Shipping Capricorn', 'COSCO Shipping Scorpio', 'COSCO Shipping Pisces', 'COSCO Shipping Aquarius',
	'MSC Oscar', 'MSC Oliver', 'MSC Zoe', 'MSC Maya', 'MSC Sveva', 'MSC Clara', 'CSCL Globe', 'CSCL Pacific Ocean', 'CSCL Indian Ocean', 'CSCL Arctic Ocean', 'CSCL Atlantic Ocean'
];

var GeneralCargoVessel = function (name, country) {
	if (country === undefined) countr = 'Bahamas';
	if (name === undefined) name = 'Cargo Vessel';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'General Cargo Vessel';
	this . speeds = [0, 1, 4, 8, 12, 15, 18];
	this . strnegth = 5;
};
inherit (GeneralCargoVessel, vessel);
GeneralCargoVessel . prototype . image = 'GeneralCargoVessel';
GeneralCargoVessel . prototype . info = 'https://en.wikipedia.org/wiki/Cargo_ship';
GeneralCargoVessel . prototype . names = [
	'Seatrade Orange', 'Seatrade Red', 'Seatrade White', 'Seatrade Blue', 'Seatrade Green',
	'Lagoon Phoenix', 'Water Phoenix', 'Sierra Queen', 'Green Chile', 'Prince of Seas', 'Cool Expresso', 'Orange Stream', 'Orange Strait', 'Orange Spirit', 'Orange Sea', 'Nova Florida',
	'Sierra King', 'Sierra Lara', 'Sierra Laurel', 'Sierra Leyre', 'Sierra Loba', 'Nova Zeelandia', 'New Takatsuki', 'Coppename'
];

var BulkCargoVessel = function (name, country) {
	if (country === undefined) countr = 'Bahamas';
	if (name === undefined) name = 'Bulk Vessel';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'Bulk Cargo Vessel';
	this . speeds = [0, 1, 4, 8, 12, 15, 18];
	this . strnegth = 5;
};
inherit (BulkCargoVessel, vessel);
BulkCargoVessel . prototype . image = 'BulkCargoVessel';
BulkCargoVessel . prototype . info = 'https://en.wikipedia.org/wiki/Bulk_carrier';
BulkCargoVessel . prototype . names = [
	'Albuquerque', 'Achilles', 'Agat', 'Akademik Arkhangelskiy', 'Akademik Korolev', 'Albatros', 'Arctowski', 'Argonaut',
	'Australian Trader', 'Blue Dolphin', 'Blue Water', 'Botany Bay', 'British Viking', 'California Rose', 'Calypso', 'City of San Diego',
	'Ciudad De Salamanca', 'Columbus Wellington', 'Confidence', 'Delaware', 'Denebola', 'Discovery Bay', 'Dvina',
	'Edinburgh', 'Ekliptika', 'Endeavour', 'Ewa', 'Falken', 'Florence', 'Francois Venture', 'Frontier', 'Fusami Maru',
	'Garibaldi', 'Geiger', 'Golden Arrow', 'Golden Bear', 'Golden Eagle', 'Golden Gate Bridge', 'Golden Fleece',
	'Golden Sun', 'Golden Tiger', 'Golden West', 'Gonazlez Ortega', 'Green Forest', 'Green Harbour', 'Green Island',
	'Gulf Explorer', 'Gulf Queen', 'Hachiko Maru', 'Hachiryu Maru', 'Hachiyo Maru', 'Hakone Maru', 'Hakucho Maru',
	'Hamburg Express', 'Hercules', 'Hermes', 'Hotaka Maru', 'Illustrious', 'Isokaze', 'Isonami', 'Itsuki Maru',
	'Juno', 'Jupiter', 'Jutland', 'Kaiyo Maru', 'Kalmar', 'Katori Maru', 'Kofu Maru', 'Kyo Maru', 'La Argentina',
	'Lion Heart', 'Lodijcke', 'Loeser', 'Luebeck', 'Luetjens',
	'Makeda', 'Makinami', 'Marine Cruiser', 'Marine Surveyor', 'Melville', 'Meteor', 'Mikura', 'Minseborg', 'Miyagi Maru',
	'Nanao Maru', 'Natsudomari', 'Nereida', 'Nordfjord', 'Oceaner', 'Ocean King',
	'Odin', 'Okichidori', 'Oksfjord', 'Omega', 'Oyama Maru', 'Oyashio Maru', 'Pathfinder', 'Polar Duke', 'Polar Explorer',
	'Polar Sea', 'Polar Star', 'Polarbjoern', 'Queensland Star', 'Reisui Maru', 'Rheinland', 'Rias Maru', 'Riasu Maru',
	'Royal Atlantic', 'Ryoko Maru', 'Sasagake Maru', 'Sea Explorer', 'Sea Star', 'Sea Venture', 'Searcher', 'Senschu Maru',
	'Sjollen', 'Skaggald', 'Southern Endeavour', 'Svenja', 'Tajima', 'Takanami', 'Tama Maru', 'Tamashima Maru', 'Toshi Maru',
	'Ulysses', 'Unryo Maru', 'Valkenburg', 'Vysokogorsk', 'Wakachiba Maru', 'Wakatake Maru', 'Wikingen', 'Xiang Yang Hong',
	'Xauen', 'Yamashin Maru', 'Yashio Maru', 'Yuryo Maru', 'Zandvoort', 'Zuiho Maru', 'Zuio Maru'
];

var Reefer = function (name, country) {
	if (country === undefined) countr = 'Bahamas';
	if (name === undefined) name = 'Reefer';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'Reefer Vessel';
	this . speeds = [0, 1, 4, 8, 12, 15, 18];
	this . strnegth = 5;
};
inherit (Reefer, vessel);
Reefer . prototype . image = 'ReeferCargoVessel';
Reefer . prototype . info = 'https://en.wikipedia.org/wiki/Reefer_ship';
Reefer . prototype . names = [
	'Baltic Klipper', 'Atlantic Klipper', 'Sweedish Reefer', 'Schweiz Reefer', 'Italia Reefer', 'Hellas Stream', 'Nederland Reefer',
	'Lombok Strait', 'Luzon Strait', 'Atlantic Reefer', 'Pacific Reefer', 'Royal Klipper', 'Comoros Stream',
	'Emerald', 'Elvira', 'Pacific Mermaid', 'Eastern Bay', 'Regal Bay', 'Atlantic Acanthus', 'Cold Stream',
	'Runaway Bay', 'Aconcagua Bay', 'Humboldt Bay', 'Fuji Bay', 'Everest Bay', 'Whitney Bay', 'Breiz Klipper'
];

var Alligator = function (name, country) {
	if (country === undefined) country = 'Russia';
	if (name === undefined) name = 'Alligator';
	vessel . call (this, country);
	this . type = 'surface';
	this . name = name;
	this . class = 'Alligator Large Landing Ship';
	this . speeds = [0, 1, 4, 8, 16, 18];
};
inherit (Alligator, vessel);
Alligator . prototype . image = 'Alligator';
Alligator . prototype . info = 'https://en.wikipedia.org/wiki/Alligator-class_landing_ship';
Alligator . prototype . names = [
	'BDK-10', 'Voronezhskiy komsomolets', 'Saratov',
	'BDK-6', 'Krymskiy komsomolets',
	'BDK-13', 'Tomskiy komsomolets', 'BDK-25',
	'BDK-62', 'Komsomolets Karelii',
	'BDK-66', 'Sergey Lazo',
	'BDK-69', 'Orsk',
	'BDK-77', '50 let shefstva VLKSM', 'BDK-80', 'Donetckiy shakhter',
	'BDK-100', 'Krasnaya Presnya',
	'BDK-104', 'Ilya Azarov',
	'Alexandr Tortcev',
	'Petr Ilyichev',
	'Nikolay Vilkov',
	'Nikolay Filchenkov',
	'Nikolay Golubkov'
];

var Virginia = function (name, country) {
	if (country === undefined) country = 'U.S.A.';
	vessel . call (this, country);
	this . class = 'Virginia SSN';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 19, 25, 30];
	this . sonar = new sonar (this);
	this . inventory = {
		'Mark 48': {constructor: Mark48, count: 29},
		'Mark 46': {constructor: Mark46, count: 16},
		Harpoon: {constructor: Harpoon, count: 4, depth: 150},
		Tomahawk: {constructor: Tomahawk, count: 4, depth: 150},
		'Mark 60 CAPTOR': {constructor: Mark60CAPTOR, count: 24}
	};
	this . tubes = build_tubes (this, {'Mark 48': ['Mark 48 Long Range', 'Mark 48 Fast'], 'Mark 46': ['Mark 46 Wakehoming'], Harpoon: ['Harpoon'], Tomahawk: ['Tomahawk'], 'Mark 60 CAPTOR': ['Mark 60 CAPTOR']}, 4);
	this . silo = {
		Tomahawk: {constructor: Tomahawk, amount: 12, depth: 150},
		Decoy: {constructor: Decoy, amount: 6}
	};
	this . test_depth = 800;
	this . collapse_depth = 1200;
	this . collapse_depth_warning = 1000;
};
inherit (Virginia, vessel);
Virginia . prototype . image = 'Virginia';
Virginia . prototype . info = 'https://en.wikipedia.org/wiki/Virginia-class_submarine';
Virginia . prototype . names = ['SSN-774 Virginia', 'SSN-775 Texas', 'SSN-776 Hawaii', 'SSN-777 North Carolina', 'SSN-778 New Hampshire', 'SSN-779 New Mexico', 'SSN-780 Missouri', 'SSN-781 California', 'SSN-782 Mississippi', 'SSN-783 Minnesota', 'SSN-784 North Dakota', 'SSN-785 John Warner', 'SSN-786 Illinois', 'SSN-787 Washington', 'SSN-788 Colorado', 'SSN-789 Indiana', 'SSN-790 South Dakota', 'SSN-791 Delaware', 'SSN-792 Vermont', 'SSN-793 Oregon', 'SSN-794 Montana', 'SSN-795 Hyman G. Rickover', 'SSN-796 New Jersey', 'SSN-797 Iowa', 'SSN-798 Massachusetts', 'SSN-799 Idaho', 'SSN-800 Arkansas', 'SSN-801 Utah'];

var Seawolf = function (name, country) {
	if (country === undefined) country = 'U.S.A.';
	vessel . call (this, country);
	this . class = 'Seawolf SSN';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 20, 25, 35];
	this . noises = [10, 120, 480, 2400, 4800, 48000, 480000];
	this . sonar = new sonar (this);
	this . inventory = {
		'Mark 48': {constructor: Mark48, count: 26},
		Harpoon: {constructor: Harpoon, count: 12, depth: 150},
		Tomahawk: {constructor: Tomahawk, count: 12, depth: 150}
	};
	this . tubes = build_tubes (this, {'Mark 48': ['Mark 48 Long Range', 'Mark 48 Fast'], Harpoon: ['Harpoon'], Tomahawk: ['Tomahawk']}, 8);
	this . silo = {Decoy: {constructor: Decoy, amount: 8}};
};
inherit (Seawolf, vessel);
Seawolf . prototype . image = 'Virginia';
Seawolf . prototype . info = 'https://en.wikipedia.org/wiki/Virginia-class_submarine';
Seawolf . prototype . names = ['SSN-21 Seawolf', 'SSN-22 Connecticut', 'SSN-23 Jimmy Carter'];

var Akula = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Акула SSN';
	this . name = name;
	this . speeds = [0, 2, 8, 15, 21, 28, 35];
	this . inventory = {
		Type65: {constructor: Type65, count: 24},
		Type53: {constructor: Type53, count: 6},
		SS_N_16: {constructor: SS_N_16, count: 6}
	};
	this . tubes = build_tubes (this, {Type65: ['Long Range', 'Fast'], Type53: ['Wakehoming'], SS_N_16: ['РПК-7 Ветер']}, 4);
	this . tubes = this . tubes . concat (build_tubes (this, {Type53: ['Wakehoming']}, 4));
	this . sonar = new sonar (this);
};
inherit (Akula, vessel);
Akula . prototype . image = 'Akula';
Akula . prototype . info = 'https://en.wikipedia.org/wiki/Akula-class_submarine';
Akula . prototype . names = ['Akula', 'Bars', 'Ak Bars', 'Delfin', 'Barnaul', 'Kashalot', 'Pantera', 'Volk', 'Kit', 'Bratsk', 'Leopard', 'Tigr', 'Narval', 'Magadan', 'Vepr', 'Morzh', 'Kuzbass', 'Gepard', 'Kuguar', 'Rys', 'Drakon', 'Samara', 'Nerpa', 'Chakra', 'Iribis'];

var Sovremenny = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Сарыч Destroyer';
	this . name = name;
	this . type = 'surface';
	this . speeds = [0, 2, 8, 15, 21, 28, 32.7];
	this . sonar = new sonar (this);
	this . strength = 4;
	this . silo = {
		'SS-N-22': {constructor: SS_N_22, amount: 8},
		'SS-N-16': {constructor: SS_N_16, amount: 12, depth: 150},
		Buk: {constructor: BUK, amount: 48, depth: 0}
	};
	this . inventory = {
		'Type 65': {constructor: Type65, count: 24}
	}
}
inherit (Sovremenny, vessel);
Sovremenny . prototype . image = 'Sovremenny';
Sovremenny . prototype . info = 'https://en.wikipedia.org/wiki/Sovremenny-class_destroyer';
Sovremenny . prototype . names = ['Sovremennyy', 'Otchayannyy', 'Otlichnyy',
'Osmotritelnyy', 'Bezuprechnyy', 'Boevoy', 'Stoykiy', 'Okrylyonnyy', 'Burnyy', 'Gremyashchiy',
'Veduschiy', 'Bystryy', 'Rastoropnyy','Bezboyaznennyy', 'Bezuderzhnyy',
'Bespokoynyy', 'Nastoychivyy', 'Moskovskiy Komsomolets', 'Admiral Ushakov', 'Besstrashnyy'];

var Udaloy = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Удалой Destroyer';
	this . name = name;
	this . type = 'surface';
	this . speeds = [0, 2, 8, 15, 22, 30, 35];
	this . sonar = new sonar (this);
	this . strength = 5;
	this . silo = {
		'SS-N-22': {constructor: SS_N_22, amount: 8},
		'SS-N-16': {constructor: SS_N_16, amount: 16, depth: 150},
		Buk: {constructor: BUK, amount: 64, depth: 0}
	};
	this . inventory = {
		'Type 65': {constructor: Type65, count: 28}
	}
}
inherit (Udaloy, vessel);
Udaloy . prototype . image = 'Udaloy';
Udaloy . prototype . info = 'https://en.wikipedia.org/wiki/Udaloy-class_destroyer';
Udaloy . prototype . names = [
	'Udaloy', 'Vice-Admiral Kulakov', 'Marshal Vasilyevsky', 'Admiral Zakharov', 'Admiral Spiridonov',
	'Admiral Tributs', 'Marshal Shaposhnikov', 'Severomorsk', 'Admiral Levchenko', 'Admiral Vinogradov',
	'Admiral Kharlamov', 'Admiral Panteleyev', 'Admiral Chabanenko', 'Admiral Basisty', 'Admiral Kucherov'
];

var Slava = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Атлант Missile Cruiser';
	this . name = name;
	this . type = 'surface';
	this . speeds = [0, 2, 8, 15, 22, 30, 35];
	this . sonar = new sonar (this);
	this . strength = 6;
	this . silo = {
		'SS-N-22': {constructor: SS_N_22, amount: 8},
		'SS-N-16': {constructor: SS_N_16, amount: 16, depth: 150},
		Buk: {constructor: BUK, amount: 64, depth: 0}
	};
	this . inventory = {
		'Type 65': {constructor: Type65, count: 28}
	}
}
inherit (Slava, vessel);
Slava . prototype . image = 'Slava';
Slava . prototype . info = 'https://en.wikipedia.org/wiki/Slava-class_cruiser';
Slava . prototype . names = [
	'Moskva', 'Slava', 'Marshal Ustinov', 'Admiral Lobov', 'Varyag', 'Chervona Ukrayina',
	'Ukrayina', 'Komsomolets', 'Oktyabrskaya Revolutsiya', 'Admiral Gorshkov', 'Varyag', 'Sevastopol'
];

var Kirov = function (name, country) {
	if (country === undefined) country = 'Russia';
	vessel . call (this, country);
	this . class = 'Орлан Heavy Missile Cruiser'
	this . name = name;
	this . type = 'surface';
	this . speeds = [0, 2, 8, 16, 24, 32, 35];
	this . sonar = new sonar (this);
	this . strength = 6;
	this . silo = {
		'SS-N-19': {constructor: SS_N_19, amount: 8},
		'SS-N-15': {constructor: SS_N_15, amount: 16, depth: 150},
		Fort: {constructor: FORT, amount: 96}
	};
	this . inventory = {
		'Type 65': {constructor: Type65, count: 64}
	}
}
inherit (Kirov, vessel);
Kirov . prototype . image = 'Kirov';
Kirov . prototype . info = 'https://en.wikipedia.org/wiki/Kirov-class_battlecruiser';
Kirov . prototype . names = [
	'Киров', 'Адмирал Ушаков', 'Адмирал Лазарев', 'Фрунзе', 'Адмирал Нахимов', 'Калинин',
	'Пётр Великий', 'Куйбышев', 'Адмирал Флота Советского Союза Кузнецов', 'Юрий Андропов'
];

/////////////
// Harpoon //
/////////////

var Harpoon = function (cable, name, country) {
	if (name === undefined) name = 'Harpoon';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . attacker = cable;
	this . type = 'rocket';
	this . class = 'Harpoon';
	this . name = name;
	this . country = country;
	this . speeds = [467, 467, 467, 467, 467, 467, 467];
	this . ai = new cruiseAI (this, 3, 3);
	this . target_type = 'surface';
	this . range = 150;
	this . strength = 1;
};
inherit (Harpoon, vessel);
Harpoon . prototype . launch = function (tube, vessel, target) {
	if (target !== undefined) this . target = target;
	if (this . target === null) return false;
	if (tube . depth > vessel . position . depth) return false;
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: -32, bearing: sp . bearing};
	this . targetBearing (this . target . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};
Harpoon . prototype . image = 'Harpoon';
Harpoon . prototype . info = 'https://en.wikipedia.org/wiki/Harpoon_(missile)';

/////////////
// SS-N-19 //
/////////////

var SS_N_19 = function (cable, name, country) {
	if (name === undefined) name = ' П-700 Гранит';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . attacker = cable;
	this . type = 'rocket';
	this . class = ' П-700 Гранит';
	this . name = name;
	this . country = country;
	this . speeds = [1100, 1100, 1100, 1100, 1100, 1100, 1100];
	this . ai = new cruiseAI (this, 7, 3);
	this . target_type = 'surface';
	this . range = 330;
	this . strength = 1;
};
inherit (SS_N_19, vessel);
SS_N_19 . prototype . launch = function (tube, vessel, target) {
	if (target !== undefined) this . target = target;
	if (this . target === null) return false;
	if (tube . depth > vessel . position . depth) return false;
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: -65, bearing: sp . bearing};
	this . targetBearing (this . target . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};
SS_N_19 . prototype . image = 'P-700 Granit';
SS_N_19 . prototype . info = 'https://en.wikipedia.org/wiki/P-700_Granit';

/////////////
// SS-N-22 //
/////////////

var SS_N_22 = function (cable, name, country) {
	if (name === undefined) name = 'П-270 Москит';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . attacker = cable;
	this . type = 'rocket';
	this . class = 'П-270 Москит';
	this . name = name;
	this . country = country;
	this . speeds = [2000, 2000, 2000, 2000, 2000, 2000, 2000];
	this . ai = new cruiseAI (this, 2, 3);
	this . target_type = 'surface';
	this . range = 65;
	this . strength = 1;
};
inherit (SS_N_22, vessel);
SS_N_22 . prototype . launch = function (tube, vessel, target) {
	if (target !== undefined) this . target = target;
	if (this . target === null) return false;
	if (tube . depth > vessel . position . depth) return false;
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: -65, bearing: sp . bearing};
	this . targetBearing (this . target . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};
SS_N_22 . prototype . image = 'Moskit';
SS_N_22 . prototype . info = 'https://en.wikipedia.org/wiki/P-270_Moskit';

//////////////
// Tomahawk //
//////////////

var Tomahawk = function (cable, name, country) {
	Harpoon . call (this, cable, name, country);
	this . class = 'Tomahawk';
	this . speeds = [480, 480, 480, 480, 480, 480, 480];
	this . ai = new cruiseAI (this, 5, 3);
	this . range = 900;
	this . strength = 1;
};
inherit (Tomahawk, Harpoon);
Tomahawk . prototype . image = 'Tomahawk';
Tomahawk . prototype . info = 'https://en.wikipedia.org/wiki/Tomahawk_(missile)';

/////////////
// Buk     //
/////////////

var BUK = function (cable, name, country) {
	if (name === undefined) name = 'Ураган';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . attacker = cable;
	this . type = 'rocket';
	this . class = 'Бук';
	this . name = name;
	this . country = country;
	this . speeds = [2000, 2000, 2000, 2000, 2000, 2000, 2000];
	this . ai = new cruiseAI (this, 2, 3);
	this . target_type = 'rocket';
	this . range = 16;
	this . strength = 1;
};
inherit (BUK, vessel);
BUK . prototype . launch = function () {return false;};
BUK . prototype . siloLaunch = function (silo, vessel, target) {
	if (target !== undefined) this . target = target;
	if (this . target === null) return false;
	if (this . depth > 0) return false;
	if (target . depth >= 0) return false;
	this . target_type = this . target . target_type;
	var vector = vessel . getRelativePositionOf (this . target);
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: -65, bearing: nauticalBearing (vector . bearing)};
	this . targetBearing (this . target . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};
BUK . prototype . image = 'Buk';
BUK . prototype . info = 'https://en.wikipedia.org/wiki/Buk_missile_system';

/////////////
// Fort    //
/////////////

var FORT = function (cable, name, country) {
	if (name === undefined) name = 'С-300Ф Форт';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . attacker = cable;
	this . type = 'rocket';
	this . class = 'С-300Ф Форт';
	this . name = name;
	this . country = country;
	this . speeds = [2600, 2600, 2600, 2600, 2600, 2600, 2600];
	this . ai = new cruiseAI (this, 2, 3);
	this . target_type = 'rocket';
	this . range = 49;
	this . strength = 1;
};
inherit (FORT, vessel);
FORT . prototype . launch = function () {return false;};
FORT . prototype . siloLaunch = function (silo, vessel, target) {
	if (target !== undefined) this . target = target;
	if (this . target === null) return false;
	if (this . depth > 0) return false;
	if (target . depth >= 0) return false;
	this . target_type = this . target . target_type;
	var vector = vessel . getRelativePositionOf (this . target);
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: -65, bearing: nauticalBearing (vector . bearing)};
	this . targetBearing (this . target . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};
FORT . prototype . image = 'Buk';
FORT . prototype . info = 'https://en.wikipedia.org/wiki/S-300_missile_system#Sea-based_S-300FM_(SA-N-20)';

///////////
// Decoy //
///////////

var Decoy = function (cable, name, country) {
	if (name === undefined) name = 'Decoy';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . type = 'submarine';
	this . class = 'Decoy';
	this . name = name;
	this . speeds = []; for (var ind in cable . speeds) this . speeds . push (cable . speeds [ind]);
	this . noises = []; for (var ind in cable . noises) this . noises . push (cable . noises [ind]);
	this . range = 2;
	var sp = cable . position;
	this . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: sp . bearing};
	this . setSpeed ('full');
	this . ai = new DecoyAI (this);
	this . strength = 0.2;
};
inherit (Decoy, vessel);
Decoy . prototype . siloLaunch = function (silo, vessel, target) {
	this . setSpeed ('full');
	addVessel (this);
	return true;
};
Decoy . prototype . image = 'Decoy';
Decoy . prototype . info = 'https://en.wikipedia.org/wiki/Sonar_decoy';

/////////////////////////
// Mark 60 CAPTOR mine //
/////////////////////////

var Mark60CAPTOR = function (cable, name, country) {
	if (name === undefined) name = 'Mark 60 CAPTOR';
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . type = 'mine';
	this . class = 'Mark 60 CAPTOR';
	this . name = name;
	this . range = 0.5;
	this . armed = false;
	this . armed_time = 200;
	this . cable = cable;
	this . noise = 0;
	this . ai = new mineAI (this, Mark48);
	var sp = cable . position;
	this . position = {x: sp . x, y: sp . y, depth: 1000, bearing: sp . bearing};
};
inherit (Mark60CAPTOR, vessel);
Mark60CAPTOR . prototype . tube_image = 'Mark60CAPTOR';
Mark60CAPTOR . prototype . image = 'Mark60CAPTOR_image';
Mark60CAPTOR . prototype . info = 'https://en.wikipedia.org/wiki/Mark_60_CAPTOR';
Mark60CAPTOR . prototype . launch = function (tube, vessel, target) {
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: sp . bearing};
	this . setSpeed ('stop');
	addVessel (this);
	return true;
};
Mark60CAPTOR . prototype . NewCount = function (count) {return count - 2;};
Mark60CAPTOR . prototype . postLaunch = function (tube) {
	if (tube . second_mine === undefined) {
		tube . command = null;
		tube . second_mine = true;
		tube . flooded = 1;
		tube . torpedo = new Mark60CAPTOR (tube . vessel);
		if (tube . display_element !== null) {
			tube . display_element . bgColor = 'red';
			tube . display_element . innerHTML = `<img src="silhouettes/Mark60CAPTOR1.png" width="100"/>`;
		}
	} else {
		delete tube . second_mine;
		vessel . prototype . postLaunch (tube);
	}
};

///////////////////////////////////////////////
// Mark 48                                   //
// Depth > 2600                              //
// Fast: 38km/55kn  Long Range: 50km/40kn    //
// Cable: 10nm / 5nm                         //
// Detection cone: 20 - 22 degrees           //
///////////////////////////////////////////////

var Mark48 = function (cable, name, country) {
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . cable = cable;
	this . attacker = cable;
	this . type = 'torpedo';
	this . class = 'Mark 48';
	this . name = name;
	this . speeds = [0, 2, 10, 25, 40, 55, 55];
	this . bearing_speeds = [0, 1, 2, 3, 4, 5, 6];
	if (name === 'Fast') this . range = 21;
	if (name === 'Long Range') {this . range = 27; this . speeds [5] = this . speeds [4];}
	this . test_depth = 1800;
	this . collapse_depth = 2700;
	this . strength = 1;
	this . sonar = new TorpedoSonar (this);
	this . sonar . noiseLevelBearingCorrection = function (noise, bearing) {
		var org = bearing;
		bearing *= 10;
		if (bearing > Math . PI || bearing < - Math . PI) bearing = 0;
		else bearing = Math . cos (bearing * 0.5);
		return noise * bearing * bearing;
	};
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
	this . ai = new torpedoAI (this);
	this . distance_travelled = 0;
	this . distance_cable_travelled = 0;
	this . cable_length = 10; this . cable_to_ship_length = 5;
	this . initial_trail_delta = 2;
	this . trail_length = 100;
};
inherit (Mark48, vessel);
Mark48 . prototype . image = 'Mark48';
Mark48 . prototype . info = 'https://en.wikipedia.org/wiki/Mark_48_torpedo';

var Mark46 = function (cable, name, country) {
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . cable = null;
	this . attacker = cable;
	this . type = 'torpedo';
	this . class = 'Mark 46';
	this . name = name;
	this . range = 6;
	this . speeds = [0, 2, 10, 20, 30, 40, 40];
	this . bearing_speeds = [0, 1, 2, 3, 4, 5, 21];
	this . test_depth = 1800;
	this . collapse_depth = 2700;
	this . strength = 1;
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
	this . ai = new wakehomingAI (this);
	this . distance_travelled = 0;
	this . initial_trail_delta = 2;
	this . trail_length = 100;
};
inherit (Mark46, vessel);
Mark46 . prototype . image = 'Mark46';
Mark46 . prototype . info = 'https://en.wikipedia.org/wiki/Mark_46_torpedo';
Mark46 . prototype . launch = function (tube, vessel, target) {
	if (waypoint === null) return false;
	this . target = null;
	this . target_waypoint = {position: {x: waypoint . position . x, y: waypoint . position . y}};
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: sp . bearing};
	this . targetBearing (this . target_waypoint . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};

var SeaLance = function (cable, name, country) {
	Harpoon . call (this, cable, name, country);
	this . class = 'Sea Lance';
	this . ai = new RocketTorpedoAI (this);
	this . target_type = 'submarine';
	this . cable_length = 0;
	this . cable_to_ship_length = 0;
	this . speeds = [1000, 1000, 1000, 1000, 1000, 1000, 1000];
	this . torpedo_speeds = [0, 2, 10, 20, 30, 40, 55];
	this . torpedo_bearing_speeds = [0, 1, 2, 3, 4, 5, 6];
	this . range = 100;
	this . torpedo_range = 6;
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
	this . sonar = new sonar (this);
};
inherit (SeaLance, Harpoon);
SeaLance . prototype . image = 'SeaLance_rocket';
SeaLance . prototype . image_alt = 'SeaLance_torpedo';
SeaLance . prototype . info = 'https://en.wikipedia.org/wiki/UUM-125_Sea_Lance';

var Type65 = function (cable, name, country) {
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . cable = cable;
	this . attacker = cable;
	this . type = 'torpedo';
	this . class = 'Type 65';
	this . name = name;
	this . noises = [10, 12, 48, 480, 300, 400, 500];
	this . speeds = [0, 2, 10, 20, 30, 50, 50];
	this . bearing_speeds = [0, 1, 2, 3, 4, 5, 6];
	if (name === 'Fast') this . range = 27;
	if (name === 'Long Range') {this . range = 54; this . speeds [5] = this . speeds [4];}
	this . test_depth = 1800;
	this . collapse_depth = 2700;
	this . strength = 1;
	this . sonar = new TorpedoSonar (this);
	this . sonar . noiseLevelBearingCorrection = function (noise, bearing) {
		var org = bearing;
		bearing *= 10;
		if (bearing > Math . PI || bearing < - Math . PI) bearing = 0;
		else bearing = Math . cos (bearing * 0.5);
		return noise * bearing * bearing;
	};
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
	this . ai = new torpedoAI (this);
	this . distance_travelled = 0;
	this . distance_cable_travelled = 0;
	this . cable_length = 10; this . cable_to_ship_length = 5;
	this . initial_trail_delta = 2;
	this . trail_length = 100;
};
inherit (Type65, vessel);
Type65 . prototype . image = 'Mark48';
Type65 . prototype . info = 'https://en.wikipedia.org/wiki/Type_65_torpedo';

var Type53 = function (cable, name, country) {
	if (country === undefined) country = cable . country;
	vessel . call (this, country);
	this . cable = null;
	this . attacker = cable;
	this . type = 'torpedo';
	this . class = 'Type 53';
	this . name = name;
	this . range = 11;
	this . speeds = [0, 2, 10, 20, 30, 44, 44];
	this . bearing_speeds = [0, 1, 2, 3, 4, 5, 21];
	this . test_depth = 1800;
	this . collapse_depth = 2700;
	this . strength = 1;
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
	this . ai = new wakehomingAI (this);
	this . distance_travelled = 0;
	this . initial_trail_delta = 2;
	this . trail_length = 100;
};
inherit (Type53, vessel);
Type53 . prototype . image = 'Mark46';
Type53 . prototype . info = 'https://en.wikipedia.org/wiki/Type_53_torpedo';
Type53 . prototype . launch = function (tube, vessel, target) {
	if (waypoint === null) return false;
	this . target = null;
	this . target_waypoint = {position: {x: waypoint . position . x, y: waypoint . position . y}};
	var sp = vessel . position;
	this . position = {x: sp . x, y: sp . y, depth: sp . depth, bearing: sp . bearing};
	this . targetBearing (this . target_waypoint . position);
	this . setSpeed ('full');
	addVessel (this);
	return true;
};

var SS_N_15 = function (cable, name, country) {
	Harpoon . call (this, cable, name, country);
	this . class = 'РПК-2 Вьюга';
	this . ai = new RocketTorpedoAI (this);
	this . target_type = 'submarine';
	this . cable_length = 0;
	this . cable_to_ship_length = 0;
	this . speeds = [600, 600, 600, 600, 600, 600, 600];
	this . torpedo_speeds = [0, 2, 10, 20, 30, 44, 44];
	this . torpedo_bearing_speeds = [0, 1, 2, 3, 4, 5, 6];
	this . range = 24;
	this . torpedo_range = 11;
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
	this . sonar = new sonar (this);
};
inherit (SS_N_15, Harpoon);
SS_N_15 . prototype . image = 'veter_rocket';
SS_N_15 . prototype . image_alt = 'veter_torpedo';
SS_N_15 . prototype . info = 'https://en.wikipedia.org/wiki/SS-N-16';

var SS_N_16 = function (cable, name, country) {
	Harpoon . call (this, cable, name, country);
	this . class = 'РПК-7 Ветер';
	this . ai = new RocketTorpedoAI (this);
	this . target_type = 'submarine';
	this . cable_length = 0;
	this . cable_to_ship_length = 0;
	this . speeds = [1000, 1000, 1000, 1000, 1000, 1000, 1000];
	this . torpedo_speeds = [0, 2, 10, 20, 30, 44, 44];
	this . torpedo_bearing_speeds = [0, 1, 2, 3, 4, 5, 6];
	this . range = 65;
	this . torpedo_range = 11;
	this . detonate = function () {explode (this, 0.01, 40, 1 + Math . random ());};
	this . sonar = new sonar (this);
};
inherit (SS_N_16, Harpoon);
SS_N_16 . prototype . image = 'veter_rocket';
SS_N_16 . prototype . image_alt = 'veter_torpedo';
SS_N_16 . prototype . info = 'https://en.wikipedia.org/wiki/SS-N-16';

