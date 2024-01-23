import { Test, TestingModule } from '@nestjs/testing';
import { MessageGenerator } from './message.generator';

describe('MessageGenerator', () => {
    let service: MessageGenerator;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MessageGenerator],
        }).compile();

        service = module.get<MessageGenerator>(MessageGenerator);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generate', () => {
        it('should generate a message with the specified size', () => {
            const sizeInBytes = 10;
            const generatedMessage = MessageGenerator.generate(sizeInBytes);
            expect(generatedMessage.length).toBe(sizeInBytes);
        });
    });
});
