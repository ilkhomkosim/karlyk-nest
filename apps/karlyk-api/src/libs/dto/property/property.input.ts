import { Field, InputType, Int } from "@nestjs/graphql";
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import { PropertyLocation, PropertyStatus, PropertyType } from "../../enums/property.enum";
import { ObjectId } from "mongoose";
import { availableOptions, availablePropertySorts } from "../../config";
import { Direction } from "../../enums/common.enum";

@InputType()
export class PropertyInput {
    @IsNotEmpty()
    @Field(() => PropertyType)
    propertyType: PropertyType;

    @IsNotEmpty()
    @Field(() => PropertyLocation)
    propertyLocation: PropertyLocation;

    @IsNotEmpty()
    @Length(3, 100)
    @Field(() => String)
    propertyTitle: string;

    @IsNotEmpty()
    @Field(() => Number)
    propertyPrice: number;

    @IsNotEmpty()
    @Field(() => Number)
    propertyLeftCount: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Field(() => Int)
    propertyVolumes: number;

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Field(() => Int)
    propertySizes: number;

    @IsNotEmpty()
    @Field(() => [String])
    propertyImages: string[];

    @IsOptional()
    @Length(5, 500)
    @Field(() => String, {nullable:true})
    propertyDesc?: string;

    @IsOptional()
    @Field(() => Boolean, {nullable:true})
    propertyBarter?: boolean;

    @IsOptional()
    @Field(() => Boolean, {nullable:true})
    propertyRent?: boolean;

    memberId?: ObjectId;

    @IsOptional()
    @Field(() => Date, {nullable: true})
    constructedAt?: Date;
}


@InputType()
export class PricesRange{
    @Field(() => Int)
    start: number;

    @Field(() => Int)
    end: number;
}

@InputType()
export class LeftCountsRange{
    @Field(() => Int)
    start: number;

    @Field(() => Int)
    end: number;
}

@InputType()
export class PeriodsRange{
    @Field(() => Int)
    start: number;

    @Field(() => Int)
    end: number;
}

@InputType()
class PISearch{
    @IsOptional()
    @Field(() => String, {nullable: true})
    memberId?: ObjectId;

    @IsOptional()
    @Field(() => [PropertyLocation], {nullable:true})
    locationList?: PropertyLocation[];

    @IsOptional()
    @Field(() => [PropertyType], {nullable: true})
    typeList?: PropertyType[];

    @IsOptional()
    @Field(() => [Int], {nullable: true})
    sizesList?: Number[];

    @IsOptional()
    @Field(() => [Int], {nullable: true})
    volumesList?: Number[];

    @IsOptional()
    @IsIn(availableOptions, {each: true})
    @Field(() => [String], {nullable: true})
    options?: string[];

    @IsOptional()
    @Field(() => PricesRange, {nullable: true})
    pricesRange?: PricesRange;

    @IsOptional()
    @Field(() => PeriodsRange, {nullable: true})
    periodsRange?: PeriodsRange;

    @IsOptional()
    @Field(() => LeftCountsRange, {nullable: true})
    leftCountsRange?: LeftCountsRange;

    @IsOptional()
    @Field(() => String, {nullable: true})
    text?: string;
}

@InputType()
    export class PropertiesInquiry{
        @IsNotEmpty()
        @Min(1)
        @Field(() => Int)
        page: number;

        @IsNotEmpty()
        @Min(1)
        @Field(() => Int)
        limit: number;

        @IsOptional()
        @IsIn(availablePropertySorts)
        @Field(() => String, {nullable: true})
        sort?: string;

        @IsOptional()
        @Field(() => Direction, {nullable: true})
        direction?: Direction;

        @IsNotEmpty()
        @Field(() => PISearch)
        search: PISearch;
    }

    @InputType()
    class APISearch {
        @IsOptional()
        @Field(() => PropertyStatus, {nullable: true})
        propertyStatus?: PropertyStatus;
    }

    @InputType()
    export class AgentPropertiesInquiry{
        @IsNotEmpty()
        @Min(1)
        @Field(() => Int)
        page: number;

        @IsNotEmpty()
        @Min(1)
        @Field(() => Int)
        limit: number;

        @IsOptional()
        @IsIn(availablePropertySorts)
        @Field(() => String, {nullable: true})
        sort?: string;

        @IsOptional()
        @Field(() => Direction, {nullable: true})
        direction?: Direction;

        @IsNotEmpty()
        @Field(() => APISearch)
        search: APISearch;
    }

    @InputType()
    class ALPSearch{
        @IsOptional()
        @Field(() => PropertyStatus, {nullable:true})
        propertyStatus?: PropertyStatus;

        @IsOptional()
        @Field(() => [PropertyLocation], {nullable:true})
        propertyLocationList?: PropertyLocation[];        
    }

    @InputType()
    export class AllPropertiesInquiry{
        @IsNotEmpty()
        @Min(1)
        @Field(() => Int)
        page: number;

        @IsNotEmpty()
        @Min(1)
        @Field(() => Int)
        limit: number;

        @IsOptional()
        @IsIn(availablePropertySorts)
        @Field(() => String, {nullable:true})
        sort?: string;

        @IsOptional()
        @Field(() => Direction, {nullable: true})
        direction?: Direction;

        @IsNotEmpty()
        @Field(() => ALPSearch)
        search: ALPSearch
    }

    @InputType()
    export class OrdinaryInquiry{
        @IsNotEmpty()
        @Min(1)
        @Field(() => Int)
        page: number;

        @IsNotEmpty()
        @Min(1)
        @Field(() => Int)
        limit: number;
    }

