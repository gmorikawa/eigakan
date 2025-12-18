export type Token = string;
export type ExpireDate = number | string | Date;
export type SecretKey = string | Buffer;

export interface TokenGenerator {
    issue<Payload extends Object>(payload: Payload, secretKey: SecretKey, expiresIn?: ExpireDate): Promise<string>;
    verify<Payload extends Object>(token: Token, secretKey: SecretKey): Promise<Payload>
}