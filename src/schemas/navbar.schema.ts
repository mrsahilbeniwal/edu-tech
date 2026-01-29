import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NavbarDocument = Navbar & Document;

// Define the nested schema for menu items
const MenuItemSchema = {
  title: { type: String, required: true },
  url: { type: String, required: true },
  isExternal: { type: Boolean, default: false },
  children: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      isExternal: { type: Boolean, default: false },
    },
  ],
};

@Schema({ timestamps: true })
export class Navbar {
  @Prop({ required: true })
  logo: string;

  @Prop({ required: true })
  logoAlt: string;

  @Prop({
    type: [MenuItemSchema],
    required: true,
  })
  menuItems: Array<{
    title: string;
    url: string;
    isExternal: boolean;
    children?: Array<{
      title: string;
      url: string;
      isExternal: boolean;
    }>;
  }>;

  @Prop({
    type: {
      text: { type: String, required: true },
      url: { type: String, required: true },
      variant: {
        type: String,
        enum: ['primary', 'secondary', 'outline'],
        default: 'primary',
      },
    },
    required: true,
  })
  ctaButton: {
    text: string;
    url: string;
    variant: 'primary' | 'secondary' | 'outline';
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const NavbarSchema = SchemaFactory.createForClass(Navbar);
