# TossPaymentConfirmRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**paymentKey** | **string** | 결제 성공 시 토스에서 쿼리 파라미터로 반환해주는 paymentKey | [default to undefined]
**orderId** | **string** | 클라이언트에서 생성한 주문 id | [default to undefined]
**amount** | **number** | 결제 금액(1000~50000원) | [optional] [default to undefined]

## Example

```typescript
import { TossPaymentConfirmRequest } from '@/api/generated';

const instance: TossPaymentConfirmRequest = {
    paymentKey,
    orderId,
    amount,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
