import { Reflector } from "@nestjs/core";

export const ServerRoles  = Reflector.createDecorator<string[]>();