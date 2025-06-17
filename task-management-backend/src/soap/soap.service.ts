import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as xml2js from 'xml2js';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SoapService {
    constructor(private httpService: HttpService) {}

    /**
     * Authenticate a user via SOAP web service
     * @param username The username to authenticate
     * @param password The password to authenticate
     * @returns Promise<boolean> True if authentication is successful
     */
    async authenticate(username: string, password: string): Promise<boolean> {
        // Create SOAP envelope for authentication request
        const soapEnvelope = `
            <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:auth="http://authentication.example.com">
                <soapenv:Header/>
                <soapenv:Body>
                    <auth:AuthenticateRequest>
                        <auth:Username>${username}</auth:Username>
                        <auth:Password>${password}</auth:Password>
                    </auth:AuthenticateRequest>
                </soapenv:Body>
            </soapenv:Envelope>
        `;

        try {
            // Replace with your actual SOAP service URL
            const soapServiceUrl = 'http://your-soap-service-url.com/authenticate';
            
            const response = await firstValueFrom(
                this.httpService.post(
                    soapServiceUrl,
                    soapEnvelope,
                    {
                        headers: {
                            'Content-Type': 'text/xml;charset=UTF-8',
                            'SOAPAction': 'http://authentication.example.com/Authenticate',
                        },
                    },
                )
            );

            // Parse SOAP response
            const parser = new xml2js.Parser({ explicitArray: false });
            const result = await parser.parseStringPromise(response.data);
            
            // Extract authentication result from SOAP response
            // Adjust this based on your actual SOAP service response structure
            const authResult = result['soapenv:Envelope']['soapenv:Body']['auth:AuthenticateResponse']['auth:Result'];
            
            return authResult === 'true' || authResult === true;
        } catch (error) {
            console.error('SOAP authentication error:', error.message);
            return false;
        }
    }
}