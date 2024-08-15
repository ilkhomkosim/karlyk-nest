import { registerEnumType } from '@nestjs/graphql';

export enum PropertyType {
	SKIN_CARE = 'SKIN_CARE',
	HAIR_CARE = 'HAIR_CARE',
	MAKEUP = 'MAKEUP',
	PERFUME = 'PERFUME',
	PERSONAL_CARE = 'PERSONAL_CARE'
}
registerEnumType(PropertyType, {
	name: 'PropertyType',
});

export enum PropertyStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(PropertyStatus, {
	name: 'PropertyStatus',
});

export enum PropertyLocation {
	Miadong987_456 = 'Miadong987_456',
	Gangbuk_ku_168 = 'Gangbuk-ku_168',
	Chungchangte_ro_244 = 'Chungchangte_ro_244',
	Tongnamgo_168 = 'Tongnamgo_168',
	Banghakro_23 = 'Banghakro_23',
	Dongilro_1345 = 'Dongilro_1345',
}
registerEnumType(PropertyLocation, {
	name: 'PropertyLocation',
});
