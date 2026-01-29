import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FooterDocument = Footer & Document;

@Schema({ timestamps: true })
export class Footer {
  @Prop({ required: true })
  logo: string;

  @Prop()
  logoAlt: string;

  @Prop()
  description: string;

  @Prop({
    type: [
      {
        title: { type: String, required: true },
        links: [
          {
            text: { type: String, required: true },
            url: { type: String, required: true },
            isExternal: { type: Boolean, default: false },
          },
        ],
      },
    ],
  })
  linkGroups: Array<{
    title: string;
    links: Array<{
      text: string;
      url: string;
      isExternal: boolean;
    }>;
  }>;

  @Prop({
    type: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
  })
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;

  @Prop({
    type: {
      email: String,
      phone: String,
      address: String,
    },
  })
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };

  @Prop()
  copyrightText: string;

  @Prop({ default: '#1a202c' })
  backgroundColor: string;

  @Prop({ default: '#ffffff' })
  textColor: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const FooterSchema = SchemaFactory.createForClass(Footer);
